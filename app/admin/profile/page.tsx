"use client"

import { useUser, useUpdateUser } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Edit2, X, Upload, User, Trash2 } from "lucide-react"
import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"

export default function ProfilePage() {
  const { data: user, isLoading } = useUser()
  const { mutate: updateUser, isPending } = useUpdateUser()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditMode, setIsEditMode] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    about: "",
    profilePicture: "",
    skills: [] as string[],
    socialLinks: [] as { platform: string; url: string; icon: string }[],
    education: [] as { institution: string; degree: string; timePeriod: string }[],
    workExperience: [] as {
      title: string
      designation: string
      location: string
      timePeriod: string
      details: string
    }[],
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        about: user.about || "",
        profilePicture: user.profilePicture || "",
        skills: user.skills || [],
        socialLinks: (user.socialLinks || []).map((link: any) => ({
          platform: link.platform || "",
          url: link.url || "",
          icon: link.icon || "",
        })),
        education: (user.education || []).map((edu: any) => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          timePeriod: edu.timePeriod || "",
        })),
        workExperience: (user.workExperience || []).map((job: any) => ({
          title: job.title || "",
          designation: job.designation || "",
          location: job.location || "",
          timePeriod: job.timePeriod || "",
          details: job.details || "",
        })),
      })
      setImagePreview(null)
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image", variant: "destructive" })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Too large", description: "Image must be under 5MB", variant: "destructive" })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setImagePreview(result)
      setFormData(prev => ({ ...prev, profilePicture: result }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData(prev => ({ ...prev, profilePicture: "" }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser(formData, {
      onSuccess: () => {
        toast({ title: "Success", description: "Profile updated successfully!" })
        setIsEditMode(false)
        setImagePreview(null)
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message || "Failed to update", variant: "destructive" })
      },
    })
  }

  const handleArrayChange = (key: keyof typeof formData, index: number, field: string, value: string) => {
    const updated = [...formData[key] as any[]]
    updated[index][field] = value
    setFormData(prev => ({ ...prev, [key]: updated }))
  }

  const handleAddItem = (key: keyof typeof formData, item: any) => {
    setFormData(prev => ({ ...prev, [key]: [...(prev[key] as any[]), item] }))
  }

  const handleRemoveItem = (key: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).filter((_, i) => i !== index)
    }))
  }

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Loading profile...</div>
  }

  const displayImage = imagePreview || formData.profilePicture

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Profile</h1>
        {isEditMode ? (
          <Button
            variant="outline"
            onClick={() => {
              setIsEditMode(false)
              setImagePreview(null)
            }}
            className="gap-2"
          >
            <X size={18} /> Cancel
          </Button>
        ) : (
          <Button onClick={() => setIsEditMode(true)} className="gap-2">
            <Edit2 size={18} /> Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            {isEditMode ? "Update your details below" : "Your public profile"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-12">
          {/* ==================== PROFILE PICTURE + HEADER ==================== */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b">
            <div className="relative group">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt="Profile picture"
                  width={80}
                  height={80}
                  className="rounded-full w-32 h-32 border-4 border-background shadow-2xl"
                  priority
                />
              ) : (
                <div className="w-44 h-44 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-20 h-20 text-muted-foreground" />
                </div>
              )}

              {isEditMode && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                >
                  <Upload className="w-10 h-10 text-white" />
                </button>
              )}
            </div>


            <div className="text-center md:text-left space-y-3">
              {!isEditMode ? (
                <>
                  <h2 className="text-4xl font-bold">{user?.name}</h2>
                  <p className="text-xl text-primary">{user?.bio || "No bio yet"}</p>
                </>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                    <Upload size={16} /> Change Photo
                  </Button>
                  {displayImage && (
                    <Button variant="destructive" size="sm" onClick={handleRemoveImage} className="ml-3 gap-2">
                      <Trash2 size={16} /> Remove Photo
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">Max 5MB • JPG, PNG, GIF</p>
                </>
              )}
            </div>
          </div>

          {/* ==================== EDIT MODE ==================== */}
          {isEditMode ? (
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Name & Bio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Input
                    value={formData.bio}
                    onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="MERN Developer | Teacher | Creator"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">About Me</label>
                <Textarea
                  rows={6}
                  value={formData.about}
                  onChange={e => setFormData(prev => ({ ...prev, about: e.target.value }))}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Skills */}
              <div>
                <label className="text-sm font-medium">Skills</label>
                <div className="mt-3 space-y-3">
                  {formData.skills.map((skill, i) => (
                    <div key={i} className="flex gap-3">
                      <Input
                        value={skill}
                        onChange={e => {
                          const updated = [...formData.skills]
                          updated[i] = e.target.value
                          setFormData(prev => ({ ...prev, skills: updated }))
                        }}
                        placeholder="React, TypeScript..."
                      />
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem("skills", i)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddItem("skills", "")}>
                    + Add Skill
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <label className="text-sm font-medium">Social Links</label>
                <div className="mt-4 space-y-5">
                  {formData.socialLinks.map((link, idx) => (
                    <div key={idx} className="p-5 border rounded-lg bg-muted/40">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input placeholder="Platform" value={link.platform} onChange={e => handleArrayChange("socialLinks", idx, "platform", e.target.value)} />
                        <Input placeholder="URL" value={link.url} onChange={e => handleArrayChange("socialLinks", idx, "url", e.target.value)} />
                        <Input placeholder="fab fa-github" value={link.icon} onChange={e => handleArrayChange("socialLinks", idx, "icon", e.target.value)} />
                      </div>
                      {link.icon && (
                        <div className="mt-4 flex items-center gap-3">
                          <i className={`${link.icon} text-2xl`} />
                          <span>{link.platform}</span>
                        </div>
                      )}
                      <div className="mt-4 text-right">
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem("socialLinks", idx)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => handleAddItem("socialLinks", { platform: "", url: "", icon: "" })}>
                    + Add Link
                  </Button>
                </div>
              </div>

              {/* Education */}
              <div>
                <label className="text-sm font-medium">Education</label>
                {formData.education.map((edu, i) => (
                  <div key={i} className="mt-4 p-5 border rounded-lg space-y-4">
                    <Input placeholder="Institution" value={edu.institution} onChange={e => handleArrayChange("education", i, "institution", e.target.value)} />
                    <Input placeholder="Degree" value={edu.degree} onChange={e => handleArrayChange("education", i, "degree", e.target.value)} />
                    <Input placeholder="2018 - 2024" value={edu.timePeriod} onChange={e => handleArrayChange("education", i, "timePeriod", e.target.value)} />
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem("education", i)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" className="mt-4" onClick={() => handleAddItem("education", { institution: "", degree: "", timePeriod: "" })}>
                  + Add Education
                </Button>
              </div>

              {/* Work Experience */}
              <div>
                <label className="text-sm font-medium">Work Experience</label>
                {formData.workExperience.map((job, i) => (
                  <div key={i} className="mt-4 p-5 border rounded-lg space-y-4">
                    <Input placeholder="Job Title" value={job.title} onChange={e => handleArrayChange("workExperience", i, "title", e.target.value)} />
                    <Input placeholder="Designation" value={job.designation} onChange={e => handleArrayChange("workExperience", i, "designation", e.target.value)} />
                    <Input placeholder="Location" value={job.location} onChange={e => handleArrayChange("workExperience", i, "location", e.target.value)} />
                    <Input placeholder="Time Period" value={job.timePeriod} onChange={e => handleArrayChange("workExperience", i, "timePeriod", e.target.value)} />
                    <Textarea placeholder="Details..." rows={4} value={job.details} onChange={e => handleArrayChange("workExperience", i, "details", e.target.value)} />
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem("workExperience", i)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleAddItem("workExperience", { title: "", designation: "", location: "", timePeriod: "", details: "" })}
                >
                  + Add Experience
                </Button>
              </div>

              <div className="flex justify-end gap-4 pt-8">
                <Button type="button" variant="outline" onClick={() => { setIsEditMode(false); setImagePreview(null); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            /* ==================== VIEW MODE ==================== */
            <div className="space-y-12">

              {/* Name & Bio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-xl font-semibold">{user?.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bio</p>
                  <p className="text-lg">{user?.bio || "No bio added yet"}</p>
                </div>
              </div>

              {/* About */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">About</p>
                <p className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {user?.about || "No about section added."}
                </p>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-4">Social Links</p>
                <div className="flex flex-wrap gap-6">
                  {user?.socialLinks && user.socialLinks.length > 0 ? (
                    user.socialLinks.map((l: any) => (
                      <a
                        key={l._id ?? l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-primary transition"
                      >
                        {l.icon ? <i className={`${l.icon} text-2xl`} /> : <div className="w-8 h-8 bg-gray-200 rounded-full" />}
                        <span className="font-medium capitalize">{l.platform}</span>
                      </a>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No social links added.</p>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-4">Education</p>
                {user?.education && user.education.length > 0 ? (
                  <ul className="space-y-5">
                    {user.education.map((e: any) => (
                      <li key={e._id ?? Math.random()} className="border-l-4 border-primary pl-6">
                        <strong className="text-lg">{e.institution}</strong>
                        <p className="text-foreground">{e.degree}</p>
                        <p className="text-sm text-muted-foreground">{e.timePeriod}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No education added.</p>
                )}
              </div>

              {/* Work Experience */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-4">Work Experience</p>
                {user?.workExperience && user.workExperience.length > 0 ? (
                  <div className="space-y-6">
                    {user.workExperience.map((w: any) => (
                      <div key={w._id ?? w.title} className="border rounded-lg p-6 bg-muted/30">
                        <h4 className="text-xl font-bold">{w.title}</h4>
                        <p className="text-foreground mt-1">
                          {w.designation} · {w.location} · {w.timePeriod}
                        </p>
                        <p className="mt-3 text-muted-foreground whitespace-pre-wrap">
                          {w.details || "No details provided."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No work experience added.</p>
                )}
              </div>

              {/* Footer */}
              <div className="border-t pt-8 space-y-2 text-sm text-muted-foreground">
                <p><strong>Email:</strong> {user?.email}</p>
                <p>
                  <strong>Member since:</strong>{" "}
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
)

}