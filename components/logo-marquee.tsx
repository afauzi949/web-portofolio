export function LogoMarquee() {
  const items = [
    { text: "Python", alt: "Python" },
    { text: "Docker", alt: "Docker" },
    { text: "Linux", alt: "Linux" },
    { text: "Cisco", alt: "Cisco" },
    { text: "OpenStack", alt: "OpenStack" },
    { text: "KVM/QEMU", alt: "KVM/QEMU" },
    { text: "SQL", alt: "SQL" },
    { text: "Bash", alt: "Bash" },
  ]

  return (
    <div className="overflow-hidden">
      <div className="relative overflow-hidden bg-black py-16 -rotate-[5deg] mt-32 mb-16 min-w-[120vw] -mx-[10vw] left-0">
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
          {[...items, ...items, ...items, ...items].map((item, index) => (
            <span key={index} className="text-white font-bold text-2xl md:text-3xl">
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
