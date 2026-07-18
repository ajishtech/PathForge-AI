import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// DEBUG ONLY - Remove after fixing login
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ step: "findUser", error: "User not found" });
    }

    if (!user.password) {
      return NextResponse.json({ step: "checkPassword", error: "No password stored" });
    }

    const passwordHash = user.password;
    const hashPrefix = passwordHash.substring(0, 10) + "...";

    let isValid = false;
    let bcryptError = null;
    try {
      isValid = await bcrypt.compare(password, passwordHash);
    } catch (e) {
      bcryptError = e instanceof Error ? e.message : String(e);
    }

    return NextResponse.json({
      userFound: true,
      userId: user.id,
      email: user.email,
      hasPassword: true,
      hashPrefix,
      hashLength: passwordHash.length,
      bcryptValid: isValid,
      bcryptError,
      bcryptVersion: typeof bcrypt.compare,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
