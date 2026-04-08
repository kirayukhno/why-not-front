// Components
import Hero from "@/components/Hero/Hero";
import Advantages from "@/components/Advantages/Advantages";
import PopularLocations from "@/components/PopularLocations/PopularLocations";
import ReviewsBlock from "@/components/ReviewsBlock/ReviewsBlock";
import { getFeedbacks } from "@/lib/api/serverApi";
import css from "./Home.module.css";

export default async function Home() {
  const reviews = await getFeedbacks();
  return (
    <main>
      <div className="container">
        <Hero />
        <Advantages />
        <PopularLocations />
        <div className={css.reviews}>
          <h2 className={css.title}>Останні відгуки</h2>
          <ReviewsBlock reviews={reviews} />
        </div>
      </div>
    </main>
  );
}
