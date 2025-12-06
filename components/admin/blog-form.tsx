// ... existing code up to line 30 ...
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCreateBlog } from "@/lib/hooks/use-blogs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

interface BlogFormProps {
  onSuccess: () => void
  blog?: any
  isEditMode?: boolean
  isPending?: boolean
  onUpdate?: (data: any) => void
}

export default function BlogForm({ onSuccess, blog, isEditMode, isPending: externalPending, onUpdate }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    tags: "",
    published: false,
    featuredImage: null as File | null,
  })

  useEffect(() => {
    if (blog && isEditMode) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        slug: blog.slug || "",
        tags: blog.tags?.join(", ") || "",
        published: blog.published || false,
        featuredImage: null,
      })
    }
  }, [blog, isEditMode])

  const { mutate: createBlog, isPending } = useCreateBlog()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.slug) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      slug: formData.slug,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published: formData.published,
      featuredImage: formData.featuredImage || undefined,
    }

    if (isEditMode && onUpdate) {
      onUpdate(payload)
    } else {
      createBlog(payload, {
        onSuccess: () => {
          toast({ title: "Success", description: "Blog created successfully" })
          onSuccess()
        },
        onError: (error: any) => {
          toast({ title: "Error", description: error.message, variant: "destructive" })
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Blog title"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Slug *</label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="blog-post-slug"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Excerpt</label>
        <Input
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Short excerpt"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Content (Rich Text) *</label>
        <div className="bg-white rounded border border-input">
          <ReactQuill
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                ["blockquote", "code-block"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
              ],
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Tags (comma-separated)</label>
          <Input
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="react, javascript, web"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Featured Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.files?.[0] || null })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          className="cursor-pointer"
        />
        <label htmlFor="published" className="text-sm font-medium cursor-pointer">
          Publish immediately
        </label>
      </div>

      <Button type="submit" disabled={externalPending || isPending} className="w-full">
        {externalPending ? "Updating..." : isPending ? "Creating..." : isEditMode ? "Update Blog" : "Create Blog"}
      </Button>
    </form>
  )
}
