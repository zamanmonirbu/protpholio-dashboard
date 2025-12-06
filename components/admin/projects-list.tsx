"use client"

import { type Project, useDeleteProject } from "@/lib/hooks/use-projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, ExternalLink, Edit2 } from "lucide-react"
import Link from "next/link"

interface ProjectsListProps {
  projects: Project[]
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const { mutate: deleteProject, isPending } = useDeleteProject()
  const { toast } = useToast()

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete project "${name}"?`)) {
      deleteProject(id, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Project "${name}" deleted successfully`,
            variant: "default",
          })
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to delete project",
            variant: "destructive",
          })
        },
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card key={project._id} className="hover:shadow-md transition-shadow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-start justify-between gap-3">
              <span className="text-lg">{project.name}</span>
              <div className="flex gap-1">
                <Link href={`/admin/projects/${project._id}`}>
                  <Button variant="outline" size="sm" title="Edit project">
                    <Edit2 size={16} />
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project._id, project.name)}
                  disabled={isPending}
                  title="Delete project"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            <div className="text-sm text-muted-foreground line-clamp-2">
              <div dangerouslySetInnerHTML={{ __html: project.description.substring(0, 100) + "..." }} />
            </div>
            <div className="flex gap-2 text-xs flex-wrap">
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink size={14} /> Live
              </a>
              <a
                href={project.frontendCode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink size={14} /> Frontend
              </a>
              <a
                href={project.backendCode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink size={14} /> Backend
              </a>
            </div>
            <div className="text-xs text-muted-foreground">
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
