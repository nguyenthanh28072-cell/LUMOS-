import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "enrollments.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: true, data: [] });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent || "[]");

    return NextResponse.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (err: any) {
    console.error("Error reading enrollments data:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to read data" },
      { status: 500 }
    );
  }
}
