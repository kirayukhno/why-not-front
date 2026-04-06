// Components
import Hero from "@/components/Hero/Hero";
import Advantages from "@/components/Advantages/Advantages";
// import PopularLocations from "@/components/PopularLocations/PopularLocations";
// import ReviewsBlock from "@/components/ReviewsBlock/ReviewsBlock";
// import { getFeedbacks } from "@/lib/api/serverApi";

export default async function Home() {
  // const reviews = await getFeedbacks();
  return (
    <main>
      <div className="container">
        <Hero />
        <Advantages />
        {/* <PopularLocations /> */}
        {/* <ReviewsBlock reviews={reviews} /> */}
      </div>
    </main>
  );
}
