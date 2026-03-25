# HireNext – Modern Resume Builder

HireNext is a modern, theme-based Resume Builder built using **Next.js 15**, **React**, and **TypeScript**.  
It allows users to create, customize, preview, and export professional resumes with a clean, modular architecture.

---

## 🚀 Features

- ✨ Live Resume Preview
- 🎨 Theme-based Customizable Templates
- 🧩 Modular Resume Sections (Education, Experience, Awards, etc.)
- 📸 Profile Photo Upload Support
- 🗂 Zustand State Management
- 📄 PDF Export Ready Architecture
- ⚡ Optimized Static Build
- 🌐 Cloudflare Pages Deployment Ready

---

## 🛠 Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS

### State Management
- Zustand

### Utilities
- Custom HTML Renderer
- Date Parsing Utilities
- Scroll-to-section Helper

### Deployment
- Cloudflare Pages (Next-on-Pages)
- `nodejs_compat`
 for Node runtime support

---

## 📂 Project Structure
```bash
├── app/
├── components/
│ ├── atoms/
│ ├── sections/
│ └── templates/
├── helpers/
│ ├── common/
│ └── utils/
├── stores/
├── public/
└── styles/
```

---

## 🧠 Architecture

The project follows an atomic design pattern:

- **Atoms** → Small reusable UI components (SectionTitle, SectionHeading, etc.)
- **Sections** → Resume blocks (Awards, Education, Experience)
- **Templates** → Complete resume layouts
- **Stores** → Zustand-managed state slices
- **Helpers** → Utility and rendering logic

All components are strongly typed using TypeScript interfaces.

Example:

```ts
interface IAwards {
  title: string;
  awarder: string;
  date: string;
  summary: string;
}
```
## ⚙️ Installation
``` bash
git clone https://github.com/your-username/hirenext-resume-builder.git
cd hirenext-resume-builder
npm install
npm run dev
```
## 🏗 Build for Production
``` bash
npm run build
```
> This generates an optimized static production build.

## 🌍 Deployment (Cloudflare Pages)

1. If deploying to Cloudflare Pages:
2. Go to Workers & Pages
3. Open your project
4. Navigate to Settings → Compatibility Flags
5. Add:
``` bash
nodejs_compat
```
6. Enable the flag for:
   - ✅ Production
   - ✅ Preview

7. Click **Save**
8. Go to **Deployments**
9. Click **Redeploy** (or push a new commit to trigger a rebuild)
## 🛡 Type Safety Example
Ensure proper prop typing:
``` bash
interface SectionHeadingProps {
  title: string;
  titleColor?: string;
}
```
> This prevents accidental prop mismatches and ensures strict validation.

## 🚀 Future Enhancements
- AI-powered resume suggestions
- ATS score analyzer
- Multi-template switching
- Cloud image storage (R2)
- Advanced PDF export engine
- User authentication dashboard

