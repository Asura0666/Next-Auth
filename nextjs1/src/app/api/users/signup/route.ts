import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { userName, email, password } = reqBody;

    console.log(reqBody);

    let user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    user = await User.findOne({ userName });

    if (user) {
      return NextResponse.json(
        { error: "UserName already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unable to create user" },
        { status: 500 }
      );
    }

    console.log(user);

    const isMailSend = await sendEmail({ email, emailType: "VERIFY", userId: user._id });

    if (!isMailSend) {
      return NextResponse.json({
        message: "User created successfully but not verified",
        success: true,
        user,
      });
    }

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user,
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
