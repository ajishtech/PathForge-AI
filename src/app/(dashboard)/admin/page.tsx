import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/layout/sidebar";
import { Card, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const [userCount, skillCount, roadmapCount, courseCount] = await Promise.all([
    prisma.user.count(),
    prisma.userSkill.count(),
    prisma.roadmapStep.count(),
    prisma.userCourse.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { name: true, email: true, careerGoal: true, createdAt: true },
  });

  return (
    <div>
      <DashboardHeader
        title="Admin Dashboard"
        description="Platform overview and user statistics"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: userCount },
          { label: "Skills Tracked", value: skillCount },
          { label: "Roadmap Steps", value: roadmapCount },
          { label: "Course Enrollments", value: courseCount },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle>Recent Users</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="text-left py-3 px-2">Name</th>
                <th className="text-left py-3 px-2">Email</th>
                <th className="text-left py-3 px-2">Career Goal</th>
                <th className="text-left py-3 px-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.email} className="border-b border-slate-800/50">
                  <td className="py-3 px-2 text-white">{user.name || "—"}</td>
                  <td className="py-3 px-2 text-slate-400">{user.email}</td>
                  <td className="py-3 px-2 text-slate-400">{user.careerGoal}</td>
                  <td className="py-3 px-2 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
