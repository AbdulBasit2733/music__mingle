import { prismaClient, YT_REGEX } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string().regex(YT_REGEX, "Invalid YouTube URL"),
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const match = data.url.match(YT_REGEX);

    if (!match || !match[1]) {
      return NextResponse.json(
        { message: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
    }

    const user = await prismaClient.user.findFirst({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const extractedId = match[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId);

    if (!res || !res.thumbnail?.thumbnails) {
      return NextResponse.json(
        { message: "Failed to fetch video details" },
        { status: 400 }
      );
    }

    const thumbnails = res.thumbnail.thumbnails.sort(
      (a, b) => a.width - b.width
    );
    const defaultImage =
      "https://static.vecteezy.com/system/resources/thumbnails/038/027/464/small_2x/ai-generated-portrait-of-a-cute-little-domestic-cat-on-a-pink-background-with-love-hearts-photo.jpg";

     const existingActiveStream = await prismaClient.stream.count({
      where:{
        userId:data.creatorId
      }
     })
     
     if(existingActiveStream > 20){
      return NextResponse.json({
        message:"You can not add more streams"
      })
     }
    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        title: res.title || "Unknown Title",
        smallImg:
          thumbnails[thumbnails.length - 2]?.url ||
          thumbnails[thumbnails.length - 1]?.url ||
          defaultImage,
        bigImg: thumbnails[thumbnails.length - 1]?.url || defaultImage,
        type: "Youtube",
      },
    });

    return NextResponse.json(
      { ...stream, hasUpvoted: false, upvotes: 0 },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating stream:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const creatorId = req.nextUrl.searchParams.get("creatorId");

  if (!creatorId) {
    return NextResponse.json(
      { message: "Creator ID not provided" },
      { status: 400 }
    );
  }

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
      where: { userId: creatorId,
        played:false
       },
      include: {
        _count: { select: { upvotes: true } },
        upvotes: { where: { userId: session?.user?.id ?? "" } },
      },
    }),await prismaClient.currentStream.findFirst({
      where: { userId: creatorId },
      include:{
        stream:true
      }
    })])

    return NextResponse.json(
      {
        streams: streams.map(({ _count, upvotes, ...rest }) => ({
          ...rest,
          upvotes: _count.upvotes,
          haveUpvoted: upvotes.length > 0,
        })),
        activeStream
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
