import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { userId, courseId } = await request.json();

    await dbConnect();

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return NextResponse.json({ error: "User is already enrolled in this course" }, { status: 400 });
    }

    // Create new enrollment
    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    // Update user's enrolledCourses array
    await User.findByIdAndUpdate(userId, { $push: { enrolledCourses: courseId } });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    await dbConnect();

    let query = {};
    if (userId) {
      query = { userId };
    }

    const enrollments = await Enrollment.find(query).populate("courseId").populate("userId");

    return NextResponse.json(enrollments);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

