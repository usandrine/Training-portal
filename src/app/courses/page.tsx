import CourseList from "@/components/course-list";

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      <CourseList />
    </div>
  );
}

