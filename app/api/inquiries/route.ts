import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Inquiry from "@/lib/models/Inquiry";
import { inquirySchemaValidation } from "@/lib/utils/validators";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { sendInquiryEmail } from "@/lib/utils/email";

// PUBLIC: Submit a new inquiry
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const result = inquirySchemaValidation.safeParse(body);
    
    if (!result.success) {
      return apiError(result.error.issues[0].message, 400, result.error.issues);
    }
    
    const inquiry = await Inquiry.create(result.data);
    
    // Send email notification (don't await to avoid delaying the response)
    sendInquiryEmail(result.data).catch(err => console.error("Email notify fail:", err));

    return apiSuccess(inquiry, "Inquiry submitted successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to submit inquiry", 500);
  }
}

// ADMIN ONLY: List all inquiries
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    await connectToDatabase();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    return apiSuccess(inquiries);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch inquiries", 500);
  }
}
