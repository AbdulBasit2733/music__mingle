import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";

const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch\?(?:.*&)?v=)|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
const SPT_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string().regex(YT_REGEX, "Invalid YouTube URL"), // Made URL validation stricter
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const match = data.url.match(YT_REGEX);
    
    if (!match) {
      return NextResponse.json(
        {
          message: "Wrong URL format",
        },
        { status: 411 }
      );
    }

    const extractedId = match[1]; // Corrected YouTube ID extraction
    const res = await youtubesearchapi.GetVideoDetails(extractedId);

    if (!res || !res.thumbnail || !res.thumbnail.thumbnails) {
      return NextResponse.json(
        {
          message: "Failed to fetch video details",
        },
        { status: 400 }
      );
    }

    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a, b) => a.width - b.width);

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId, // Fixed incorrect property name (was creatordId)
        url: data.url,
        extractedId,
        title: res.title ?? "Cannot find title",
        smallImg:
          thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1]?.url ??
              "https://static.vecteezy.com/system/resources/thumbnails/038/027/464/small_2x/ai-generated-portrait-of-a-cute-little-domestic-cat-on-a-pink-background-with-love-hearts-photo.jpg",
        bigImg:
          thumbnails[thumbnails.length - 1]?.url ??
          "https://static.vecteezy.com/system/resources/thumbnails/038/027/464/small_2x/ai-generated-portrait-of-a-cute-little-domestic-cat-on-a-pink-background-with-love-hearts-photo.jpg",
        type: "Youtube",
      },
    });
    return NextResponse.json(
      {
        message: "Added Stream",
        id: stream.id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error While Adding a stream",
        error: error.message,
      },
      { status: 500 } // Changed status to 500 for internal server errors
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId"); // Fixed incorrect variable name

  const streams = await prismaClient.stream.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });

  return NextResponse.json({
    streams,
  });
}
