"use client"

import { useState } from "react"
import { useBlogs } from "@/lib/hooks/use-blogs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import BlogForm from "@/components/admin/blog-form"
import BlogsList from "@/components/admin/blogs-list"

export default function BlogsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: blogs, isLoading } = useBlogs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blogs Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" />
          {showForm ? "Cancel" : "New Blog"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Blogs ({blogs?.length || 0})</h2>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading blogs...</div>
        ) : blogs && blogs.length > 0 ? (
          <BlogsList blogs={blogs} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">No blogs yet</div>
        )}
      </div>
    </div>
  )
}
