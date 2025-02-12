import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
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

    const mostUpvotedStream = await prismaClient.stream.findFirst({
      where: { userId: user.id,
        played:false
       },
      orderBy: { upvotes: { _count: "desc" } },
    });

    if (!mostUpvotedStream) {
      return NextResponse.json({ message: "No streams available" }, { status: 404 });
    }

    // Upsert and delete in a transaction to avoid inconsistencies
    await prismaClient.$transaction([
      prismaClient.currentStream.upsert({
        where: { userId: user.id },
        update: { streamId: mostUpvotedStream.id },
        create: { userId: user.id, streamId: mostUpvotedStream.id },
      }),
      prismaClient.stream.update({
        where: { id: mostUpvotedStream.id },
        data:{
            played:true,
            playedTs:new Date()
        }
      },
    ),
    ]);

    return NextResponse.json({ success: true, data: mostUpvotedStream }, { status: 200 });
  } catch (error) {
    console.error("Error fetching next stream:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
