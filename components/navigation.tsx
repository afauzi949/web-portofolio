"use client"

import { Mail, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const target = document.querySelector(targetId)
    if (target) {
      const navHeight = 100
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight
      window.scrollTo({ top: targetPosition, behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#portfolio", label: "Portfolio" },
  ]

  const externalLinks = [
    { href: "https://github.com/afauzi949", label: "GitHub" },
    { href: "https://linkedin.com/in/achmad-al-fauzi-dhiaulhaq/", label: "LinkedIn" },
  ]

  return (
    <div className="container mx-auto px-4 pt-8 pb-4 sticky top-0 z-50">
      <nav className="flex items-center justify-between bg-white border-4 border-black rounded-xl px-5 py-3 max-w-2xl mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm bg-white/95">
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => smoothScroll(e, "#home")}
          className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform duration-300"
        >
          <span className="text-white font-bold text-sm">AF</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => smoothScroll(e, link.href)}
              className="text-[18px] font-bold leading-[20px] hover:text-[#6366F1] transition-all duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6366F1] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          {externalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[18px] font-bold leading-[20px] hover:text-[#6366F1] transition-all duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6366F1] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Email Button */}
        <Button
          asChild
          className="hidden md:flex bg-black text-white hover:bg-black/90 rounded-sm px-5 h-12 min-w-[48px] flex-shrink-0 hover:scale-105 transition-transform duration-300"
        >
          <a href="mailto:alfauzi949@gmail.com">
            <Mail className="w-10 h-10" strokeWidth={2.5} />
          </a>
        </Button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute left-4 right-4 top-full mt-2 bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-500 ease-out ${
          mobileMenuOpen 
            ? "opacity-100 translate-y-0 max-h-96" 
            : "opacity-0 -translate-y-4 max-h-0 pointer-events-none"
        }`}
      >
        <div className="p-4 space-y-2">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => smoothScroll(e, link.href)}
              className="block text-[18px] font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:translate-x-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
          <div className="border-t-2 border-gray-200 my-2"></div>
          {externalLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[18px] font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:translate-x-2"
              style={{ animationDelay: `${(navLinks.length + index) * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
          <div className="border-t-2 border-gray-200 my-2"></div>
          <a
            href="mailto:alfauzi949@gmail.com"
            className="flex items-center gap-3 text-[18px] font-bold py-3 px-4 rounded-lg bg-black text-white hover:bg-gray-900 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            Get in touch
          </a>
        </div>
      </div>
    </div>
  )
}
