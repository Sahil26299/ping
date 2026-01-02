import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import Chat from "@/models/Chats";
import dbConnect from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await dbConnect();
    // Find chats where user is a participant
    const chats = await Chat.find({ participants: decoded.userId })
      .populate(
        "participants",
        "username email profilePicture isOnline lastActive"
      )
      .populate("lastMessage.sender", "username")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    console.error("Get Chats Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { recipientId } = await req.json();
    if (!recipientId) {
      return NextResponse.json(
        { error: "Recipient ID required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if chat already exists (for 1-on-1)
    // We look for a chat with exactly these two participants and isGroupChat: false (if we implemented that flag, checking schema...)
    // My schema has isGroupChat.

    const existingChat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [decoded.userId, recipientId], $size: 2 },
    });

    if (existingChat) {
      return NextResponse.json({ chat: existingChat }, { status: 200 });
    }

    const newChat = await Chat.create({
      participants: [decoded.userId, recipientId],
      isGroupChat: false,
      unreadCounts: {
        [decoded.userId]: 0,
        [recipientId]: 0,
      },
    });

    return NextResponse.json({ chat: newChat }, { status: 201 });
  } catch (error) {
    console.error("Create Chat Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
