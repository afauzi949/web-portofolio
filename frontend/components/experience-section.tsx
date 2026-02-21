import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function ExperienceSection() {
  const experiences = [
    {
      period: "Jul 2025 - Nov 2025",
      title: "Security Manpower Training Program 2025",
      company: "NSHC Security",
      description:
        "Engaged in hands-on labs, real-world attack simulations, and professional mentoring with Korean cybersecurity specialists. Completed intensive malware analysis training covering reverse engineering and dynamic analysis.",
      icon: "/nshc.jpg",
    },
    {
      period: "Dec 2024 - Feb 2025",
      title: "Cyber Defense Incident Responder Intern",
      company: "DISKOMINFO Yogyakarta - KamiSandi",
      description:
        "Supported incident response operations including threat investigation, log analysis, and mitigation. Built internal security automation tools and implemented password strength enforcement.",
      icon: "/csirt-diy.jpg",
    },
    {
      period: "Feb 2024 - Jun 2024",
      title: "AI & IoT Bootcamp",
      company: "Samsung Innovation Campus Batch 5",
      description:
        "Completed 4-month intensive training in AI & IoT with hands-on experience in sensor integration, device programming, and data communication. Delivered a functional IoT solution through capstone project.",
      icon: "/samsung.jpg",
    },
    {
      period: "Jun 2021 - Aug 2021",
      title: "Network Engineer Intern",
      company: "PT. Selaras Citra Terabit",
      description:
        "Performed network equipment installation and configuration including routers, switches, and access points. Assisted in troubleshooting network connectivity issues and maintaining network integrity.",
      icon: "/terabit.jpg",
    },
  ]

  return (
    <section className="bg-black py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="text-white pt-0 md:pt-12 md:sticky md:top-12 self-start">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8 leading-[1.3]">
              Take a look at my{" "}
              <span className="bg-[#6366F1] text-white px-3 py-1 inline-block">experience journey</span>
            </h2>
            <p className="text-gray-400 mb-8 md:mb-10 leading-relaxed text-base md:text-lg">
              From network engineering to cybersecurity, I've built a strong foundation in protecting and optimizing IT
              infrastructure through hands-on experience and continuous learning.
            </p>
            <Button
              asChild
              className="bg-white text-black hover:bg-gray-50 rounded-lg py-5 px-8 md:py-[22px] md:px-[62px] text-base md:text-lg font-semibold h-auto w-full sm:w-auto sm:min-w-[240px]"
            >
              <a href="https://linkedin.com/in/achmad-al-fauzi-dhiaulhaq/" target="_blank" rel="noopener noreferrer">
                <FileText className="w-5 h-5" />
                See full resume
              </a>
            </Button>
          </div>

          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-white border-4 border-black rounded-3xl min-h-[220px] md:min-h-[280px]">
                <div className="flex items-center justify-between mb-4 md:mb-6 pt-6 md:pt-8 px-6 md:px-8">
                  <div className="text-base md:text-[22px] leading-tight md:leading-[34px] font-bold text-[#0B0B0B]">
                    {exp.period}
                  </div>
                  <div className="rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-1">
                    <Image
                      src={exp.icon || "/placeholder.svg"}
                      alt={exp.title}
                      width={48}
                      height={48}
                      className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full"
                    />
                  </div>
                </div>

                <div className="border-t-[3px] border-black mb-4 md:mb-6"></div>

                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <h3 className="text-xl md:text-[28px] leading-tight md:leading-[40px] font-bold text-[#0B0B0B] mb-1">
                    {exp.title}
                  </h3>
                  <p className="text-base md:text-[18px] leading-tight font-semibold text-[#6366F1] mb-2 md:mb-3">
                    {exp.company}
                  </p>
                  <p className="text-[#393939] text-base md:text-[18px] leading-relaxed md:leading-[28px]">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
