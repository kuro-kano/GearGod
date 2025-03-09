import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

async function getUserId() {
  const session = await getServerSession();
  const cookieStore = cookies();
  const guestId = cookieStore.get("guestId")?.value;
  return session?.user?.id || guestId || "guest";
}

// ฟังก์ชันสำหรับลบเฉพาะ cart
async function clearCartOnly() {
  // Clear cart cookie only
  cookies().set({
    name: "cart",
    value: "",
    expires: new Date(0),
    path: "/",
  });

  // Clear guest ID cookie if exists
  const cookieStore = cookies();
  if (cookieStore.get("guestId")) {
    cookies().set({
      name: "guestId",
      value: "",
      expires: new Date(0),
      path: "/",
    });
  }
}

// ฟังก์ชันสำหรับลบคุกกี้ทั้งหมด (ยกเว้น session)
async function clearAllCookiesExceptSession() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  allCookies.forEach((cookie) => {
    // ไม่ลบคุกกี้ที่เกี่ยวกับ session
    if (
      !cookie.name.includes("session") &&
      !cookie.name.includes("next-auth")
    ) {
      cookieStore.set({
        name: cookie.name,
        value: "",
        expires: new Date(0),
        path: "/",
      });
    }
  });
}

export async function GET() {
  await clearCartOnly();
  return NextResponse.json({
    success: true,
    message: "Cart cleared successfully",
  });
}

export async function DELETE() {
  await clearAllCookiesExceptSession();
  return NextResponse.json({
    success: true,
    message: "All cookies cleared (except session)",
  });
}
