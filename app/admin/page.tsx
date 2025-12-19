"use client"

import { useUser } from "@/lib/hooks/use-auth"
import { useProjects } from "@/lib/hooks/use-projects"
import { useBlogs } from "@/lib/hooks/use-blogs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const { data: user } = useUser()
  const { data: projectsData } = useProjects()
  const { data: blogs } = useBlogs();
  console.log("blogs", blogs)

  const projectPagination = projectsData?.pagination
  const blogPagination = blogs?.pagination



  const stats = [
    { label: "Total Projects", value: projectPagination?.totalProjects || 0 },
    { label: "Total Blogs",  value: blogPagination?.totalBlogs || 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Navigate to manage your content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <a href="/admin/projects" className="block text-primary hover:underline">
            Manage Projects →
          </a>
          <a href="/admin/blogs" className="block text-primary hover:underline">
            Manage Blogs →
          </a>
          <a href="/admin/profile" className="block text-primary hover:underline">
            Edit Profile →
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
