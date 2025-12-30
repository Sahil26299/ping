import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import Message from "@/models/Message";
import Chat from "@/models/Chats";
import dbConnect from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    await dbConnect();
    const chat = await Chat.findByIdAndUpdate(chatId, {
      $set: {
        [`unreadCounts.${decoded.userId}`]: 0,
      },
    });

    const messages = await Message.find({ chatId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });

    return NextResponse.json(
      {
        messages: [
          ...messages?.map((msg) => ({
            ...msg?._doc,
            messageId: msg?._id,
            sender: { ...msg?.sender?._doc, uid: msg?.sender?._doc?._id },
          })),
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Messages Error:", error);
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

    const { chatId, content, type = "text" } = await req.json();

    if (!chatId || !content) {
      return NextResponse.json(
        { error: "ChatID and content are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newMessage = await Message.create({
      chatId,
      sender: decoded.userId,
      content,
      type,
      readBy: [decoded.userId],
    });

    // Fetch the chat to get all participants
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Build unread count updates: increment for all participants except sender
    const unreadCountUpdates: any = {};
    chat.participants.forEach((participantId: any) => {
      const participantIdStr = participantId.toString();
      if (participantIdStr !== decoded.userId) {
        unreadCountUpdates[`unreadCounts.${participantIdStr}`] = 1;
      }
    });

    // Update Chat's last message and increment unread counts
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: {
        content,
        sender: decoded.userId,
        timestamp: new Date(),
      },
      $inc: unreadCountUpdates,
    });

    return NextResponse.json({ message: {...newMessage?._doc, sender: {uid: decoded.userId, username: decoded.username}} }, { status: 201 });
  } catch (error) {
    console.error("Send Message Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
