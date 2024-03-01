import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

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
        { error: 'Unable to create user' },
        { status: 500 }
      );
    }

    console.log(user);

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



// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel"; // Ensure correct import path
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";

// // Connect to the database
// connect();

// export async function POST(req: NextRequest, res: NextResponse) {
//   try {
//     const reqBody = await req.json();

//     const { userName, email, password } = reqBody;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     // Hash the password securely
//     const salt = await bcryptjs.genSalt(10);
//     const hashedPassword = await bcryptjs.hash(password, salt);

//     // Create a new user instance
//     const newUser = new User({
//       userName,
//       email,
//       password: hashedPassword,
//     });

//     // Save the new user to the database
//     await newUser.save();

//     // Return a successful response with the created user
//     return NextResponse.json({
//       message: "User created successfully",
//       success: true,
//       user: newUser,
//     });
//   } catch (error: any) {
//     // Handle errors gracefully
//     console.error(error); // Log the error for debugging purposes
//     return NextResponse.json(
//       { error: error.message || "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
