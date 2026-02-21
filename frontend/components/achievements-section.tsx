import { Award, Trophy } from "lucide-react"

export function AchievementsSection() {
  const achievements = [
    {
      title: "Top 12 Cybersecurity Training in South Korea",
      description:
        "Selected as one of the Top 12 performers nationwide to receive an exclusive cybersecurity onsite training opportunity in South Korea with NSHC Security.",
      icon: Trophy,
      color: "bg-[#6366F1]",
    },
    {
      title: "Bronze Certificate - APJC NetAcad Riders 2025",
      description:
        "Awarded the Bronze Certificate in the APJC NetAcad Riders 2025 international networking competition hosted by Cisco Networking Academy.",
      icon: Award,
      color: "bg-[#2F81F7]",
    },
    {
      title: "Semifinalist - Samsung Innovation Campus 2024",
      description:
        "Selected as a semifinalist in the Samsung Innovation Campus 2024 competition among 4,000+ participants nationwide.",
      icon: Award,
      color: "bg-[#FFC224]",
    },
  ]

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-[52px] md:leading-[60px] font-bold mb-4">
              Achievements & <span className="bg-[#FF4A60] text-white px-3 py-1 inline-block">Recognition</span>
            </h2>
            <p className="text-[#393939] text-base md:text-lg font-medium leading-relaxed md:leading-[30px] max-w-2xl mx-auto">
              Recognition from international competitions and exclusive training programs in cybersecurity and
              networking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div
                  key={index}
                  className="bg-white border-[3px] border-black rounded-[32px] p-8 hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                >
                  <div
                    className={`${achievement.color} w-16 h-16 rounded-2xl border-2 border-black flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[24px] leading-[32px] font-bold mb-3 text-[#0B0B0B]">{achievement.title}</h3>
                  <p className="text-[16px] leading-[26px] font-medium text-[#393939]">{achievement.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
