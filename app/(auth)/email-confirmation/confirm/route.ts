import { NextRequest, NextResponse } from "next/server";
import { AuthStatus } from "@/types/auth";

export async function GET(request: NextRequest) {
    // not implemented
    return NextResponse.next();
    // const { searchParams } = new URL(request.url);
    // const token = searchParams.get("token");
    // if (!token || token === "null") {
    //     return NextResponse.json({ message: "Token not found" }, { status: 400 });
    // }
    // const { data, authStatus } = await confirmUser(token);
    // if (authStatus === AuthStatus.EMAIL_CONFIRMED) {
    //     // const email = data?.user.email;
    //     // const { data: signInData, authStatus: signInStatus } = await signInWithOnlyEmail(email!);
    //     // if (signInStatus === AuthStatus.SUCCESS) {
    //     //     return NextResponse.json(signInData, { status: 200 });
    //     // } else {
    //     //     return NextResponse.json({ message: "Error signing in" }, { status: 400 });
    //     // }
    //     return NextResponse.redirect(new URL("/signin", request.url));
    // } else {
    //     return NextResponse.json({ message: "Error confirming email" }, { status: 400 });
    // }
}
