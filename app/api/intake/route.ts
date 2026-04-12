import { NextRequest, NextResponse } from "next/server"

const BACKEND = "https://mqxnyexmrk.us-east-1.awsapprunner.com"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const resp = await fetch(`${BACKEND}/public/intake`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await resp.json()
    return NextResponse.json(data, { status: resp.ok ? 200 : 500 })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Submission failed" }, { status: 500 })
  }
}
