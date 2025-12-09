"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CreateProjectPayload, useCreateProject } from "@/lib/hooks/use-projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"
import { X } from "lucide-react"

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
}: CreateProjectPayload & ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    liveLink: "",
    frontendCode: "",
    backendCode: "",
    videoLink: "",
    technologies: [] as string[],
    timelinePhoto: null as File | null,
    otherPhotos: [] as File[],
  })

  const [techInput, setTechInput] = useState("")

  useEffect(() => {
    if (project && isEditMode) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        liveLink: project.liveLink || "",
        frontendCode: project.frontendCode || "",
        backendCode: project.backendCode || "",
        videoLink: project.videoLink || "",
        technologies: project.technologies || [],
        timelinePhoto: null,
        otherPhotos: [],
      })
    }
  }, [project, isEditMode])

  const { mutate: createProject, isPending } = useCreateProject()
  const { toast } = useToast()

  const addTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault()
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] })
      }
      setTechInput("")
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({ ...formData, technologies: formData.technologies.filter(t => t !== tech) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const required = !formData.name || !formData.description || !formData.liveLink || !formData.frontendCode || !formData.backendCode
    if (required) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Name */}
      <div>
        <Label>Project Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="My Awesome Project"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description (Rich Text) *</Label>
        <div className="bg-white dark:bg-black rounded-lg border border-input overflow-hidden">
          <ReactQuill
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            theme="snow"
            className="h-64"
          />
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Live Link *</Label>
          <Input
            value={formData.liveLink}
            onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
            placeholder="https://example.com"
            required
          />
        </div>
        <div>
          <Label>Video Demo Link</Label>
          <Input
            value={formData.videoLink}
            onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
            placeholder="https://youtube.com/..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Frontend Code Link *</Label>
          <Input
            value={formData.frontendCode}
            onChange={(e) => setFormData({ ...formData, frontendCode: e.target.value })}
            placeholder="https://github.com/..."
            required
          />
        </div>
        <div>
          <Label>Backend Code Link *</Label>
          <Input
            value={formData.backendCode}
            onChange={(e) => setFormData({ ...formData, backendCode: e.target.value })}
            placeholder="https://github.com/..."
            required
          />
        </div>
      </div>

      {/* Technologies */}
      <div>
        <Label>Technologies (Press Enter to add)</Label>
        <Input
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={addTechnology}
          placeholder="React, Node.js, Tailwind..."
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary text-primary-foreground"
            >
              {tech}
              <button type="button" onClick={() => removeTechnology(tech)}>
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Timeline Photo (Main Image)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, timelinePhoto: e.target.files?.[0] || null })}
          />
        </div>
        <div>
          <Label>Other Photos (Multiple)</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              setFormData({ ...formData, otherPhotos: files })
            }}
          />
          {formData.otherPhotos.length > 0 && (
            <p className="text-xs text-foreground/60 mt-1">{formData.otherPhotos.length} file(s) selected</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={externalPending || isPending}>
        {externalPending ? "Updating..." : isPending ? "Creating..." : isEditMode ? "Update Project" : "Create Project"}
      </Button>
    </form>
  )
}