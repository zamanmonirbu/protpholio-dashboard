"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import BlogForm from "@/components/admin/blog-form"
import BlogsList from "@/components/admin/blogs-list"
import { useBlogs } from "@/lib/hooks/use-blogs"

export default function BlogsPage() {
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState(1)
  const { data: blogsData, isLoading } = useBlogs(page)

  const blogs = blogsData?.blogs || []
  const pagination = blogsData?.pagination

  const handlePrev = () => {
    if (pagination?.hasPrevPage) setPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (pagination?.hasNextPage) setPage((prev) => prev + 1)
  }

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
        <h2 className="text-xl font-semibold">All Blogs ({blogs.length})</h2>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading blogs...</div>
        ) : blogs.length > 0 ? (
          <>
            <BlogsList blogs={blogs} />

            {/* Pagination */}
            {pagination && (
              <div className="flex justify-center gap-2 mt-4">
                <Button onClick={handlePrev} disabled={!pagination.hasPrevPage}>
                  Prev
                </Button>
                <span className="px-2 py-1">{page} / {pagination.totalPages}</span>
                <Button onClick={handleNext} disabled={!pagination.hasNextPage}>
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No blogs yet</div>
        )}
      </div>
    </div>
  )
}
