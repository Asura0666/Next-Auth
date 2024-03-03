import { getDataFromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select(
      "-password -createdAt -updatedAt -__v"
    );

    if (!user.isVerified) {
      const isMailSend = await sendEmail({
        email: user?.email,
        emailType: "VERIFY",
        userId: user._id,
      });

      if (!isMailSend) {
        return NextResponse.json({
          message: "email is not send",
          user,
        });
      }
    }

    const isMailSend = await sendEmail({
      email: user?.email,
      emailType: "RESET",
      userId: user._id,
    });

    if (!isMailSend) {
      return NextResponse.json({
        message: "email is not send",
        user,
      });
    }

    return NextResponse.json({
      mesaaage: "email is send",
      data: user,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
