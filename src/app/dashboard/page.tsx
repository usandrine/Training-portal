import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserDashboard from "@/components/user-dashboard";

async function getUser() {
  const userId = (await cookies()).get("userId")?.value;

  if (!userId) {
    return null;
  }

  // Use our dedicated auth/me endpoint to get user data
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/me`, {
    headers: {
      Cookie: `userId=${userId}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      <UserDashboard user={user} />
    </div>
  );
}

