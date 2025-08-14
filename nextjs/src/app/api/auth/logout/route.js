import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Logged out successfully" },
    {
      headers: {
        "Set-Cookie": `session=; Path=/; HttpOnly; Max-Age=0;`,
      },
    }
  );
}
