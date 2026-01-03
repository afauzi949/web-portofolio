import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="container mx-auto px-4 py-16 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div className="flex justify-center">
          <div className="relative w-full max-w-lg aspect-square border-[4px] border-black rounded-full overflow-hidden bg-[#FF6B6B] shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Image src="/images/about-me.svg" alt="About me illustration" fill className="object-cover" />
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Who's behind this{" "}
              <span className="bg-[#2F81F7] text-white px-3 py-1 inline-block">cybersecurity work?</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              I'm an Internet Technology Engineering student at Universitas Gadjah Mada with a GPA of 3.81/4.00, focused
              on building expertise in cybersecurity, networking, and cloud infrastructure.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-5 h-5 bg-[#6366F1] border-2 border-black rounded-[5px] flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Top 12 Cybersecurity Training in South Korea</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Selected as one of the Top 12 performers nationwide for exclusive onsite cybersecurity training with
                  NSHC Security in South Korea.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-5 h-5 bg-[#FF6B7A] border-2 border-black rounded-[5px] flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">International Networking Competition Award</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Awarded the Bronze Certificate in the APJC NetAcad Riders 2025 international networking competition
                  hosted by Cisco Networking Academy.
                </p>
              </div>
            </div>
          </div>

          <Button asChild className="bg-[#0B0B0B] text-white hover:bg-black/90 rounded-lg py-5 px-8 md:py-[22px] md:px-[62px] text-base md:text-lg font-semibold h-auto w-full sm:w-auto sm:min-w-[240px]">
            <a href="https://linkedin.com/in/achmad-al-fauzi-dhiaulhaq/" target="_blank" rel="noopener noreferrer">
              <User className="w-5 h-5" />
              More about me
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
