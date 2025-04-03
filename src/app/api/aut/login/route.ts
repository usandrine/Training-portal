import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user exists with this email
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if none exists with this email
      user = new User({
        name,
        email,
        enrolledCourses: [],
      });
      await user.save();
    } else {
      // Update the name if it's different
      if (user.name !== name) {
        user.name = name;
        await user.save();
      }
    }

    // Return user data (in a real app, you'd create a JWT or session)
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}

