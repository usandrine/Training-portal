'use client';

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import CourseDetails from "@/components/course-details";
import { useEffect, useState } from "react";

function getCourse(id: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/courses/${id}`, {
    cache: "no-store",
  }).then(res => {
    if (!res.ok) {
      return null;
    }
    return res.json();
  });
}

export default function CoursePage() {
  const params = useParams<{ id: string; }>();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (params.id) {
      getCourse(params.id).then(data => {
        if (!data) {
          notFound();
        }
        setCourse(data);
      });
    }
  }, [params.id]);

  if (!course) {
    return null; // or loading state
  }

  return <CourseDetails course={course} />;
}

