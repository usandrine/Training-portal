import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

type RouteParams = Promise<{ id: string; }>;

export async function GET(request: Request, { params }: { params: RouteParams; }) {
  const resolvedParams = await params;

  try {
    await dbConnect();
    const course = await Course.findById(resolvedParams.id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}
