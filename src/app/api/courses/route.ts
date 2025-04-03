import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find({});
    return NextResponse.json(courses);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();

    const course = new Course(body);
    await course.save();

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

