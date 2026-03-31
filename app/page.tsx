// Components
import Hero from "@/components/Hero/Hero";
import Advantages from "@/components/Advantages/Advantages";
import PopularLocations from "@/components/PopularLocations/PopularLocations";

export default function Home() {
  return (
    <main>
      <div className="container">
        <Hero />
        <Advantages />
        <PopularLocations />
      </div>
    </main>
  );
}
