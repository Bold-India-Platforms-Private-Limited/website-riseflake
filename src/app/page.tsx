import CTA from './components/CTA'
import FAQ from './components/FAQ'
import Features from './components/Features'
import Footer from './components/Footer'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Navbar from './components/Navbar'
import Newsletter from './components/Newsletter'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import TrustBar from './components/TrustBar'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
      <Newsletter />
      <Footer />
    </>
  )
}
