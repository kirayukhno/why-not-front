// Components
import Hero from "@/components/Hero/Hero";
import Advantages from "@/components/Advantages/Advantages";

export default function Home() {
  return (
    <main>
      <div className="container hero-bg">
        <Hero />
      </div>
      <div className="container">
        <Advantages />
      </div>
    </main>
  );
}
