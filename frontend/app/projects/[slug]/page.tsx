"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Linkedin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getProjectBySlug } from "@/lib/projects-data"
import { fetchProject, API_URL } from "@/lib/api"

interface ProjectData {
  slug: string
  title: string
  description: string
  tag: string
  bgColor: string
  bgColorRaw: string
  illustration: string
  technologies: string[]
  outcome: string
  github: string
  fullDescription: string
  systemArchitecture: string[]
  keyFeatures: string[]
  systemFlow: string[]
}

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try API first
    fetchProject(slug)
      .then((p: any) => {
        const imgSrc = p.image_path
          ? p.image_path.startsWith("/uploads") ? `${API_URL}${p.image_path}` : p.image_path
          : "/placeholder.svg"
        setProject({
          slug: p.slug,
          title: p.title,
          description: p.description,
          tag: p.category,
          bgColor: p.bg_color ? `bg-[${p.bg_color}]` : "bg-[#6366F1]",
          bgColorRaw: p.bg_color || "#6366F1",
          illustration: imgSrc,
          technologies: p.tech_stack || [],
          outcome: p.highlight || "",
          github: p.external_link || "",
          fullDescription: p.full_description || "",
          systemArchitecture: p.system_architecture || [],
          keyFeatures: p.key_features || [],
          systemFlow: p.system_flow || [],
        })
      })
      .catch(() => {
        // Fallback to static data
        const staticProject = getProjectBySlug(slug)
        if (staticProject) {
          setProject({
            slug: staticProject.slug,
            title: staticProject.title,
            description: staticProject.description,
            tag: staticProject.tag,
            bgColor: staticProject.bgColor,
            bgColorRaw: "",
            illustration: staticProject.illustration,
            technologies: staticProject.technologies,
            outcome: staticProject.outcome,
            github: staticProject.github || "",
            fullDescription: staticProject.fullDescription,
            systemArchitecture: staticProject.systemArchitecture || [],
            keyFeatures: staticProject.keyFeatures,
            systemFlow: staticProject.systemFlow || [],
          })
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Project tidak ditemukan</h1>
        <Link href="/#portfolio" className="text-[#6366F1] font-semibold hover:underline">
          ← Kembali ke Portfolio
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <nav className="flex items-center justify-between bg-white border-4 border-black rounded-xl px-5 py-3 max-w-2xl mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <Link href="/#portfolio" className="flex items-center gap-2 font-bold hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </Link>
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">AF</span>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block bg-black text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            {project.tag}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {project.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            {project.github && (
              <Button asChild className="bg-black text-white hover:bg-gray-900 rounded-xl px-6 py-6 h-auto">
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </a>
              </Button>
            )}
            <Button asChild className="bg-[#0A66C2] text-white hover:bg-[#004182] rounded-xl px-6 py-6 h-auto">
              <a href="https://www.linkedin.com/in/achmad-al-fauzi-dhiaulhaq/details/projects/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 mr-2" />
                View All Projects
              </a>
            </Button>
          </div>

          <div
            className={`${project.bgColor} relative rounded-3xl border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
            style={project.bgColorRaw ? { backgroundColor: project.bgColorRaw } : undefined}
          >
            <div className="aspect-video relative">
              <Image
                src={project.illustration || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      {project.technologies.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Technologies Used</h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-base font-medium px-5 py-2.5 rounded-full border-2 border-gray-200 hover:border-black transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Description */}
      {project.fullDescription && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-50 border-4 border-black rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Project Overview</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {project.fullDescription}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* System Architecture */}
      {project.systemArchitecture && project.systemArchitecture.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">System Architecture</h2>
            <div className="grid gap-4">
              {project.systemArchitecture.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-3 border-black rounded-2xl p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Features */}
      {project.keyFeatures && project.keyFeatures.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {project.keyFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white border-3 border-black rounded-2xl p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* System Flow */}
      {project.systemFlow && project.systemFlow.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">System Flow</h2>
            <div className="relative">
              {project.systemFlow.map((step, index) => (
                <div key={index} className="flex gap-6 mb-6 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#2F81F7] rounded-full flex items-center justify-center border-4 border-black">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    {index < project.systemFlow.length - 1 && (
                      <div className="w-1 h-full bg-black min-h-[40px]"></div>
                    )}
                  </div>
                  <div className="flex-1 bg-white border-3 border-black rounded-2xl p-6 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outcome */}
      {project.outcome && (
        <section className="container mx-auto px-4 py-12 pb-24">
          <div className="max-w-5xl mx-auto">
            <div
              className={`${project.bgColor} border-4 border-black rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
              style={project.bgColorRaw ? { backgroundColor: project.bgColorRaw } : undefined}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-md">Project Outcome</h2>
              <p className="text-xl md:text-2xl font-medium text-white drop-shadow-md leading-relaxed">
                ✓ {project.outcome}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer Navigation */}
      <section className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <Link
              href="/#portfolio"
              className="text-white font-bold text-lg hover:opacity-70 transition-opacity flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Portfolio
            </Link>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/afauzi949"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/achmad-al-fauzi-dhiaulhaq/details/projects/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0A66C2] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#004182] transition-colors flex items-center gap-2"
              >
                <Linkedin className="w-5 h-5" />
                More Projects
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
