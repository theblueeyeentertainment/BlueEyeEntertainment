import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { connectToDatabase } from "@/lib/db/connect";
import Inquiry from "@/lib/models/Inquiry";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return apiError("Unauthorized", 401);
    }

    await connectToDatabase();
    
    // Find inquiries by user's email address
    const inquiries = await Inquiry.find({ clientEmail: session.user.email })
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(inquiries);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch user inquiries", 500);
  }
}
