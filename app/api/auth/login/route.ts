// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   console.log(req);
//   return NextResponse.json({});
// }
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log(req);
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
