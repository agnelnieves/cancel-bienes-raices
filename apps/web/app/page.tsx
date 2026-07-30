import { Navbar, Footer } from "@/components/marketing/chrome"
import { Hero } from "@/components/marketing/hero"
import { ToolsBento } from "@/components/marketing/bento"
import { StatsBar, DataMoat, CopilotFeature } from "@/components/marketing/sections-top"
import { Pricing, Testimonials, Faq, FinalCta } from "@/components/marketing/sections-bottom"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <ToolsBento />
        <DataMoat />
        <CopilotFeature />
        <Pricing />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
