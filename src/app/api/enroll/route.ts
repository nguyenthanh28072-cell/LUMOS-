import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      studentId,
      className,
      selectedDepartments,
      departmentTitles,
      understandingReason,
      strengthsWeaknesses,
      messageToLcd,
      timestamp,
      // Legacy fields fallback
      name,
      email,
    } = body;

    const nameToSave = fullName || name;
    if (!nameToSave) {
      return NextResponse.json(
        { success: false, error: "Họ và tên là bắt buộc" },
        { status: 400 }
      );
    }

    const submission = {
      id: `ENR-${Date.now()}`,
      fullName: nameToSave,
      studentId: studentId || "N/A",
      className: className || "N/A",
      selectedDepartments: selectedDepartments || [],
      departmentTitles: departmentTitles || [],
      understandingReason: understandingReason || "N/A",
      strengthsWeaknesses: strengthsWeaknesses || "N/A",
      messageToLcd: messageToLcd || "",
      timestamp: timestamp || new Date().toISOString(),
    };

    // 1. Local JSON Backup
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const filePath = path.join(dataDir, "enrollments.json");
      let existingData: any[] = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = JSON.parse(fileContent || "[]");
      }

      existingData.push(submission);
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
    } catch (fsErr) {
      console.error("Error writing local backup:", fsErr);
    }

    // 2. Google Sheets Webhook forwarding (if configured in .env.local)
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.trim() !== "") {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
      } catch (sheetsErr) {
        console.error("Error forwarding to Google Sheets:", sheetsErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Đã tiếp nhận đơn đăng ký thành công!",
      data: submission,
    });
  } catch (err: any) {
    console.error("Enrollment API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
