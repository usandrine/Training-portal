"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Course {
  _id: string
  title: string
  shortDescription: string
  duration: string
  instructor: {
    name: string
  }
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses")

        if (!res.ok) {
          throw new Error("Failed to fetch courses")
        }

        const data = await res.json()
        setCourses(data)
      } catch (err) {
        setError("Failed to load courses. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-[300px]">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (courses.length === 0) {
    return <div className="text-center py-8">No courses available at the moment.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course._id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>By {course.instructor.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>{course.shortDescription}</p>
            <p className="text-sm text-muted-foreground mt-4">Duration: {course.duration}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/courses/${course._id}`} className="w-full">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

