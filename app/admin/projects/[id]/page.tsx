"use client"

import { use } from "react"
import { useProject, useUpdateProject } from "@/lib/hooks/use-projects"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import ProjectForm from "@/components/admin/project-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)   // ✅ FIX

  const router = useRouter()
  const { data: project, isLoading } = useProject(id)
  const { mutate: updateProject, isPending } = useUpdateProject()
  const { toast } = useToast()

  const handleUpdate = (formData: any) => {
    updateProject(
      { id, payload: formData },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Project updated successfully",
          })
          router.push("/admin/projects")
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update project",
            variant: "destructive",
          })
        },
      }
    )
  }

  if (isLoading) return <div className="text-center py-8">Loading...</div>
  if (!project) return <div className="text-center py-8 text-destructive">Project not found</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>

      <ProjectForm
        project={project}
        onSuccess={() => {}}
        isEditMode
        isPending={isPending}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
