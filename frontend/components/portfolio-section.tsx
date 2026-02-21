"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { projects as staticProjects } from "@/lib/projects-data"
import { fetchProjects, API_URL } from "@/lib/api"

interface ApiProject {
  id: string
  slug: string
  title: string
  category: string
  description: string
  tech_stack: string[]
  highlight: string
  image_path: string
  external_link: string
  bg_color: string
  full_description: string
  key_features: string[]
  system_architecture: string[]
  system_flow: string[]
}

function mapApiProject(p: ApiProject) {
  const imgSrc = p.image_path
    ? p.image_path.startsWith("/uploads") ? `${API_URL}${p.image_path}` : p.image_path
    : "/placeholder.svg"
  return {
    slug: p.slug,
    title: p.title,
    tag: p.category,
    description: p.description,
    technologies: p.tech_stack || [],
    outcome: p.highlight || "",
    bgColor: p.bg_color ? `bg-[${p.bg_color}]` : "bg-[#6366F1]",
    bgColorRaw: p.bg_color || "#6366F1",
    illustration: imgSrc,
  }
}

export function PortfolioSection() {
  const [projects, setProjects] = useState(
    staticProjects.map((p) => ({
      slug: p.slug,
      title: p.title,
      tag: p.tag,
      description: p.description,
      technologies: p.technologies,
      outcome: p.outcome,
      bgColor: p.bgColor,
      bgColorRaw: "",
      illustration: p.illustration,
    }))
  )

  useEffect(() => {
    fetchProjects()
      .then((apiProjects: ApiProject[]) => {
        if (apiProjects.length > 0) {
          setProjects(apiProjects.map(mapApiProject))
        }
      })
      .catch(() => {
        // Fallback to static data (already set)
      })
  }, [])

  return (
    <section id="portfolio" className="container mx-auto px-4 py-16 md:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Take a look at my <br />
            <span className="bg-[#FFC224] text-black px-3 py-1 inline-block">project portfolio</span>
          </h2>
        </div>

        <div className="space-y-8 mb-12">
          {projects.map((project, index) => (
            <Link
              key={index}
              href={`/projects/${project.slug}`}
              className="group grid md:grid-cols-2 bg-white border-[3px] border-black rounded-[32px] overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer block"
            >
              <div className="p-6 md:p-12 flex flex-col justify-center bg-white">
                <span className="inline-block bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 w-fit">
                  {project.tag}
                </span>

                <h3 className="text-xl md:text-[28px] font-bold mb-4 leading-tight md:leading-[40px] text-[#0B0B0B]">
                  {project.title}
                </h3>

                <p className="text-base md:text-[18px] text-[#393939] mb-6 leading-relaxed md:leading-[30px] font-medium line-clamp-3">
                  {project.description}
                </p>

                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {project.outcome && (
                  <p className="text-sm text-[#6366F1] font-semibold mb-6">
                    ✓ {project.outcome}
                  </p>
                )}

                <span className="flex items-center gap-2 font-semibold text-[#0B0B0B] group-hover:gap-3 transition-all text-sm md:text-base">
                  View Project Details
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              <div
                className={`${project.bgColor} relative overflow-hidden min-h-[250px] md:min-h-[500px]`}
                style={project.bgColorRaw ? { backgroundColor: project.bgColorRaw } : undefined}
              >
                <Image
                  src={project.illustration || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  unoptimized
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="https://github.com/afauzi949"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-6 md:px-8 py-4 md:py-5 rounded-[12px] font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Browse GitHub Projects
          </a>
        </div>
      </div>
    </section>
  )
}
