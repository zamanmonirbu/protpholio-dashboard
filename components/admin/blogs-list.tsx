"use client"

import { type Blog, useDeleteBlog } from "@/lib/hooks/use-blogs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Eye, EyeOff, Edit2 } from "lucide-react"
import Link from "next/link"

interface BlogsListProps {
  blogs: Blog[]
}

export default function BlogsList({ blogs }: BlogsListProps) {
  const { mutate: deleteBlog, isPending } = useDeleteBlog()
  const { toast } = useToast()

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete blog "${title}"?`)) {
      deleteBlog(id, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Blog "${title}" deleted successfully`,
            variant: "default",
          })
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to delete blog",
            variant: "destructive",
          })
        },
      })
    }
  }

  return (
    <div className="space-y-3">
      {blogs.map((blog) => (
        <Card key={blog._id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">{blog.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{blog.excerpt || "No excerpt"}</p>
              <div className="flex gap-3 mt-2 text-xs">
                <span className="text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  {blog.published ? (
                    <>
                      <Eye size={14} /> Published
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} /> Draft
                    </>
                  )}
                </span>
                <span className="text-muted-foreground">{blog.reader || 0} reads</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/blogs/${blog._id}`}>
                <Button variant="outline" size="sm" title="Edit blog">
                  <Edit2 size={16} />
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(blog._id, blog.title)}
                disabled={isPending}
                title="Delete blog"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
