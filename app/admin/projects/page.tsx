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
  const [page, setPage] = useState(1) 
  const { data, isLoading } = useProjects(page) 

  const projects = data?.projects
  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      {/* Header + Toggle Form */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" />
          {showForm ? "Cancel" : "New Project"}
        </Button>
      </div>

      {/* Project Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm
              onSuccess={() => setShowForm(false)}
              name=""
              description=""
              liveLink=""
              frontendCode=""
              backendCode=""
            />
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          All Projects ({pagination?.totalProjects || 0})
        </h2>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading projects...
          </div>
        ) : projects && projects.length > 0 ? (
          <ProjectsList projects={projects} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No projects yet
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
              <Button
                key={num}
                variant={num === pagination.currentPage ? "default" : "outline"}
                onClick={() => setPage(num)}
              >
                {num}
              </Button>
            ))}

            <Button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
