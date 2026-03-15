import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const name = searchParams.get("name");
  const userId = searchParams.get("userId");
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json(
      { error: "Missing roomId query parameter in request" },
      { status: 400 },
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId query parameter in request" },
      { status: 400 },
    );
  }

  const LIVEKIT_APIKEY = process.env.LIVEKIT_API_KEY;
  const LIVEKIT_APISECRET = process.env.LIVEKIT_SECRET;

  const accessToken = new AccessToken(LIVEKIT_APIKEY, LIVEKIT_APISECRET, {
    name: name || "User",
    identity: userId,
  });

  accessToken.addGrant({ roomJoin: true, room: roomId });
  const token = await accessToken.toJwt();
  return NextResponse.json({ token });
}
