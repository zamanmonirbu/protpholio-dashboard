"use client"

import { use } from "react"
import { useBlog, useUpdateBlog } from "@/lib/hooks/use-blogs"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import BlogForm from "@/components/admin/blog-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)   // ✅ FIX

  const router = useRouter()
  const { data: blog, isLoading } = useBlog(id)
  const { mutate: updateBlog, isPending } = useUpdateBlog()
  const { toast } = useToast()

  const handleUpdate = (formData: any) => {
    updateBlog(
      { id, payload: formData },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Blog updated successfully",
          })
          router.push("/admin/blogs")
        },
      }
    )
  }

  if (isLoading) return <div className="text-center py-8">Loading...</div>
  if (!blog) return <div className="text-center py-8 text-destructive">Blog not found</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Blog</h1>
      </div>

      <BlogForm
        blog={blog}
        isEditMode
        isPending={isPending}
        onUpdate={handleUpdate}
        onSuccess={() => {}}
      />
    </div>
  )
}
