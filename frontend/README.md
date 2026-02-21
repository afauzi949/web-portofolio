# 🚀 Achmad Al Fauzi - Portfolio Website

A modern, responsive portfolio website built with Next.js, React, TypeScript, and Tailwind CSS. Showcasing projects in cybersecurity, cloud infrastructure, IoT, and machine learning.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

- **Responsive Design** - Fully responsive layout optimized for all devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Project Portfolio** - Dynamic project showcase with detailed pages
- **Smooth Navigation** - Anchor-based scrolling with section highlighting
- **Performance Optimized** - Built with Next.js App Router for optimal performance
- **SEO Friendly** - Proper meta tags and semantic HTML structure

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts (Custom) |

---

## 📂 Project Structure

```
web-porto/
├── app/                          # Next.js App Router
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── projects/
│       └── [slug]/
│           └── page.tsx          # Dynamic project detail pages
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── about-section.tsx         # About section
│   ├── achievements-section.tsx  # Achievements section
│   ├── experience-section.tsx    # Experience timeline
│   ├── footer.tsx                # Footer component
│   ├── hero-section.tsx          # Hero/landing section
│   ├── logo-marquee.tsx          # Logo carousel
│   ├── navigation.tsx            # Navigation bar
│   ├── portfolio-section.tsx     # Project portfolio grid
│   └── services-section.tsx      # Technical expertise cards
├── lib/
│   ├── projects-data.ts          # Project content data
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets (images)
├── .gitignore
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/afauzi949/web-portfolio.git
   cd web-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

---

## 🎨 Customization

### Modifying Content

| Content | File Location |
|---------|---------------|
| Hero Section | `components/hero-section.tsx` |
| About Section | `components/about-section.tsx` |
| Projects Data | `lib/projects-data.ts` |
| Services/Expertise | `components/services-section.tsx` |
| Experience | `components/experience-section.tsx` |
| Achievements | `components/achievements-section.tsx` |

### Adding New Projects

Edit `lib/projects-data.ts` and add a new project object:

```typescript
{
  slug: "project-slug",
  title: "Project Title",
  description: "Short description...",
  tag: "Category",
  bgColor: "bg-[#HexColor]",
  illustration: "/image-path.jpg",
  technologies: ["Tech1", "Tech2"],
  outcome: "Project outcome...",
  fullDescription: "Detailed description...",
  keyFeatures: ["Feature 1", "Feature 2"],
  // Optional
  github: "https://github.com/...",
  systemArchitecture: ["Component 1", "Component 2"],
  systemFlow: ["Step 1", "Step 2"],
}
```

### Image Guidelines

| Location | Recommended Size | Aspect Ratio |
|----------|------------------|--------------|
| Project Cards | 1600 × 900 px | 16:9 |
| Service Cards | 764 × 656 px | ~1.16:1 |
| Hero Avatar | 800 × 800 px | 1:1 |

---

## 📱 Sections Overview

1. **Hero** - Introduction with name, title, and CTA buttons
2. **Logo Marquee** - Scrolling technology/company logos
3. **Services** - Technical expertise cards
4. **About** - Personal introduction with achievements
5. **Portfolio** - Project showcase with clickable cards
6. **Achievements** - Awards and recognition
7. **Experience** - Professional experience timeline
8. **Footer** - Contact information and links

---

## 🔗 Featured Projects

| Project | Category | Technologies |
|---------|----------|--------------|
| OpenStack Private Cloud | Cloud Infrastructure | OpenStack, MongoDB, TensorFlow, ELK Stack |
| Container Monitoring System | DevOps | Docker, Portainer, Nginx Proxy Manager |
| Car Price MLOps Pipeline | MLOps | Python, XGBoost, MLflow, FastAPI |
| Smart Farming IoT | IoT & AI | ESP32, MongoDB, Streamlit |
| Pet Feeding System | IoT | ESP32, Telegram Bot, Docker |
| Cardiovascular Prediction | AI & Healthcare | Python, XGBoost, Ensemble Learning |
| Water Monitoring IoT | Embedded Systems | ESP32, Blynk, Telegram |
| SecValidator Security Header | Security API | Python, FastAPI, Docker |
| SecValidator Password Strength | Security API | Python, FastAPI, Cryptography |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Achmad Al Fauzi Dhiaulhaq**

- 🎓 Internet Technology Engineering Student @ Universitas Gadjah Mada
- 🔐 Specializing in Cybersecurity & Cloud Infrastructure
- 📧 Email: [alfauzi949@gmail.com](mailto:alfauzi949@gmail.com)
- 💼 LinkedIn: [achmad-al-fauzi-dhiaulhaq](https://linkedin.com/in/achmad-al-fauzi-dhiaulhaq/)
- 🐙 GitHub: [afauzi949](https://github.com/afauzi949)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Lucide](https://lucide.dev/) - Icon Library
- [Vercel](https://vercel.com/) - Deployment Platform
