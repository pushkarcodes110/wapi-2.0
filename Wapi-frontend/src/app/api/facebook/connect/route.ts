/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authoption } from "../../auth/[...nextauth]/authOption";
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_API_URL } from "@/src/constants/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authoption);
    const token = session?.accessToken as string | undefined;

    const body = await request.json();

    const response = await fetch(`${PUBLIC_API_URL}/facebook/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
      console.log("🚀 ~ POST ~ body:", body)

    const data = await response.json();
    console.log("🚀 ~ POST ~ data:", data)
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.log("🚀 ~ POST ~ error:", error)
    console.error("Error in Facebook callback proxy:", error);
    return NextResponse.json({ success: false, error: "Failed to process Facebook setup", details: error.message }, { status: 500 });
  }
}
