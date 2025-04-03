"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Instructor {
  name: string;
  bio: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  prerequisites: string[];
  instructor: Instructor;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
}

export default function CourseDetails({ course }: { course: Course; }) {
  const [enrolling, setEnrolling] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch the current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Check if user is already enrolled
  const isEnrolled = user?.enrolledCourses?.includes(course._id);

  async function handleEnroll() {
    if (!user) {
      // Redirect to login if no user is logged in
      router.push("/login");
      return;
    }

    setEnrolling(true);

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          courseId: course._id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to enroll in course");
      }

      // toast({
      //   title: "Success!",
      //   description: "You have successfully enrolled in this course.",
      // });

      // Redirect to dashboard after successful enrollment
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        // toast({
        //   title: "Error",
        //   description: error.message,
        //   variant: "destructive",
        // });
      }
    } finally {
      setEnrolling(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        Back to Courses
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">{course.title}</CardTitle>
          <CardDescription className="text-lg">{course.shortDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">About this Course</h3>
            <p className="whitespace-pre-line">{course.fullDescription}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Course Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Duration:</p>
                <p>{course.duration}</p>
              </div>
              <div>
                <p className="font-medium">Prerequisites:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {course.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="secondary">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Instructor</h3>
            <p className="font-medium">{course.instructor.name}</p>
            <p className="text-muted-foreground">{course.instructor.email}</p>
            <p className="mt-2">{course.instructor.bio}</p>
          </div>
        </CardContent>
        <CardFooter>
          {loading ? (
            <Button disabled className="w-full">
              Loading...
            </Button>
          ) : !user ? (
            <Button onClick={() => router.push("/login")} className="w-full">
              Login to Enroll
            </Button>
          ) : isEnrolled ? (
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
              Already Enrolled - Go to Dashboard
            </Button>
          ) : (
            <Button onClick={handleEnroll} disabled={enrolling} className="w-full">
              {enrolling ? "Enrolling..." : "Enroll in Course"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

