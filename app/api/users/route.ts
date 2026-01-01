import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await dbConnect();

    // 1. Find all chats where the current user is a participant
    const existingChats = await import("@/models/Chats").then((mod) =>
      mod.default.find({ participants: decoded.userId })
    );

    // 2. Extract IDs of users who are already in a chat with the current user
    const existingChatUserIds = existingChats.reduce(
      (acc: string[], chat: any) => {
        chat.participants.forEach((participantId: any) => {
          const pIdStr = participantId.toString();
          if (pIdStr !== decoded.userId) {
            acc.push(pIdStr);
          }
        });
        return acc;
      },
      []
    );

    // 3. Filter out current user AND users already in chat
    const filter: any = {
      _id: { $nin: [decoded.userId, ...existingChatUserIds] },
    };

    if (query) {
      filter.username = { $regex: query, $options: "i" };
    }

    const users = await User.find(filter).select(
      "username email profilePicture isOnline lastActive "
    );

    // Map _id to uid to keep frontend compatible
    const mappedUsers = users.map((u) => ({
      uid: u._id.toString(),
      ...u.toObject(),
    }));

    return NextResponse.json({ users: mappedUsers }, { status: 200 });
  } catch (error) {
    console.error("Get Users Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
