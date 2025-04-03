"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  _id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
}

interface Course {
  _id: string;
  title: string;
  shortDescription: string;
  duration: string;
}

export default function UserDashboard({ user }: { user: User; }) {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnrolledCourses() {
      try {
        // Fetch all courses the user is enrolled in
        const promises = user.enrolledCourses.map(async (courseId) => {
          const res = await fetch(`/api/courses/${courseId}`);
          if (!res.ok) throw new Error("Failed to fetch course");
          return res.json();
        });

        const courses = await Promise.all(promises);
        setEnrolledCourses(courses);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEnrolledCourses();
  }, [user.enrolledCourses]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.name}!</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven&apos;t enrolled in any courses yet.</p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course._id}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>Duration: {course.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{course.shortDescription}</p>
                  <div className="mt-4">
                    <Link href={`/courses/${course._id}`}>
                      <Button variant="outline">View Course</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

