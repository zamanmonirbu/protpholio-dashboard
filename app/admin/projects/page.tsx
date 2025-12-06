"use client"

import { useState } from "react"
import { useProjects } from "@/lib/hooks/use-projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import ProjectForm from "@/components/admin/project-form"
import ProjectsList from "@/components/admin/projects-list"

export default function ProjectsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: projects, isLoading } = useProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" />
          {showForm ? "Cancel" : "New Project"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Projects ({projects?.length || 0})</h2>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
        ) : projects && projects.length > 0 ? (
          <ProjectsList projects={projects} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">No projects yet</div>
        )}
      </div>
    </div>
  )
}
