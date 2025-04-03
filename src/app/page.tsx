                                                import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Employee Training Portal</h1>
        <p className="text-xl text-muted-foreground">Enhance your skills with our curated courses</p>
      </header>

      <div className="flex flex-col items-center justify-center gap-6">
        <Link href="/courses">
          <Button size="lg">Browse Courses</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            My Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

