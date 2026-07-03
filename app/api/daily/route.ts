import { NextResponse } from "next/server";
import { getRoom, isApiConfigured } from "@/lib/daily";
import { tenantConfig } from "@/lib/tenant-config";

export async function GET() {
  if (!isApiConfigured()) {
    return NextResponse.json({
      configured: false,
      note: "DAILY_API_KEY not set — room is public, no key required to join",
    });
  }

  const roomName = new URL(tenantConfig.dailyRoomUrl).pathname.split("/").pop();
  if (!roomName) {
    return NextResponse.json({ error: "Invalid room URL" }, { status: 500 });
  }

  const room = await getRoom(roomName);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({
    configured: true,
    room: {
      id: room.id,
      name: room.name,
      privacy: room.privacy,
      url: room.url,
      created_at: room.created_at,
      config: room.config,
    },
  });
}
