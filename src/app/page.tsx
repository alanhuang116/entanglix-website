import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Platform from "@/components/Platform";
import Agents from "@/components/Agents";
import DataServices from "@/components/DataServices";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Platform />
        <Agents />
        <DataServices />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
