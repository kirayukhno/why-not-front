// Components
import Hero from "@/components/Hero/Hero";
import Advantages from "@/components/Advantages/Advantages";
import PopularLocations from "@/components/PopularLocations/PopularLocations";
import ReviewsBlock from "@/components/ReviewsBlock/ReviewsBlock";

export default function Home() {
  return (
    <main>
      <div className="container">
        <Hero />
        <Advantages />
        <PopularLocations />
        <ReviewsBlock reviews={[]} />
      </div>
    </main>
  );
}