"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import css from "./Hero.module.css";

export default function Hero() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    }

    const query = params.toString();
    router.push(query ? `/locations?${query}` : "/locations");
  };

  return (
    <section className={css.hero}>
      <div className={css.heroWrap}>
        <h1 className={css.heroTitle}>
          Відкрий для себе Україну. Знайди ідеальне місце для відпочинку
        </h1>
        <p className={css.heroSubtitle}>
          Тисячі перевірених локацій з реальними фото та відгуками від мандрівників.
        </p>
        <form className={css.heroSearch} onSubmit={handleSubmit}>
          <input
            className={css.regionInput}
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Введіть назву локації..."
          />
          <button type="submit" className={css.button + " primary-btn"}>
            Знайти місце
          </button>
        </form>
      </div>
    </section>
  );
}
