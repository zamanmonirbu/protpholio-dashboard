// ... existing code up to line 20 ...
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCreateProject } from "@/lib/hooks/use-projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

interface ProjectFormProps {
  onSuccess: () => void
  project?: any
  isEditMode?: boolean
  isPending?: boolean
  onUpdate?: (data: any) => void
}

export default function ProjectForm({
  onSuccess,
  project,
  isEditMode,
  isPending: externalPending,
  onUpdate,
}: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    liveLink: "",
    frontendCode: "",
    backendCode: "",
    timelinePhoto: null as File | null,
  })

  useEffect(() => {
    if (project && isEditMode) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        liveLink: project.liveLink || "",
        frontendCode: project.frontendCode || "",
        backendCode: project.backendCode || "",
        timelinePhoto: null,
      })
    }
  }, [project, isEditMode])

  const { mutate: createProject, isPending } = useCreateProject()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.description ||
      !formData.liveLink ||
      !formData.frontendCode ||
      !formData.backendCode
    ) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    if (isEditMode && onUpdate) {
      onUpdate(formData)
    } else {
      createProject(formData, {
        onSuccess: () => {
          toast({ title: "Success", description: "Project created successfully" })
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
      <div>
        <label className="text-sm font-medium">Project Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Project name"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description (Rich Text) *</label>
        <div className="bg-white rounded border border-input">
          <ReactQuill
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
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
          <label className="text-sm font-medium">Live Link *</label>
          <Input
            value={formData.liveLink}
            onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Timeline Photo</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, timelinePhoto: e.target.files?.[0] || null })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Frontend Code Link *</label>
          <Input
            value={formData.frontendCode}
            onChange={(e) => setFormData({ ...formData, frontendCode: e.target.value })}
            placeholder="https://github.com/..."
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Backend Code Link *</label>
          <Input
            value={formData.backendCode}
            onChange={(e) => setFormData({ ...formData, backendCode: e.target.value })}
            placeholder="https://github.com/..."
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={externalPending || isPending} className="w-full">
        {externalPending ? "Updating..." : isPending ? "Creating..." : isEditMode ? "Update Project" : "Create Project"}
      </Button>
    </form>
  )
}
