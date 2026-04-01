"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import css from "./PopularLocations.module.css";
import "swiper/css";
import "swiper/css/navigation";

// Тестові дані (замінити на реальні дані з API)
const LOCATIONS = [
  {
    id: 1,
    name: "Сонячна Рів'єра",
    image: "/images/location1.jpg",
    category: "Море",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Типігульський Спокій",
    image: "/images/location2.jpg",
    category: "Море",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Кінбурнська Вільниця",
    image: "/images/location3.jpg",
    category: "Море",
    rating: 4.5,
  },
  {
    id: 4,
    name: "Локація 4",
    image: "/images/location4.jpg",
    category: "Гори",
    rating: 4,
  },
  {
    id: 5,
    name: "Локація 5",
    image: "/images/location5.jpg",
    category: "Ліс",
    rating: 5,
  },
];

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={css.stars}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={
            i < fullStars
              ? css.starFull
              : i === fullStars && hasHalfStar
                ? css.starHalf
                : css.starEmpty
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function PopularLocations() {
  return (
    <section className={css.popularLocations}>
      <div className={css.popularLocationsWrap}>
        <div className={css.popularLocationsHeader}>
          <h2 className={css.title}>Популярні локації</h2>
          <button className={css.button + " primary-btn"}>Всі локації</button>
        </div>

        <div className={css.swiperContainer}>
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: `.${css.buttonNext}`,
              prevEl: `.${css.buttonPrev}`,
            }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              375: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1440: { slidesPerView: 3, spaceBetween: 32 },
            }}
            className={css.swiper}
          >
            {LOCATIONS.map((location) => (
              <SwiperSlide key={location.id} className={css.slide}>
                <div className={css.locationCard}>
                  <img
                    src={location.image}
                    alt={location.name}
                    className={css.cardImage}
                  />
                  <div className={css.cardContent}>
                    <p className={css.category}>{location.category}</p>
                    {renderStars(location.rating)}
                    <h3 className={css.cardTitle}>{location.name}</h3>
                    <button className={css.cardButton}>
                      Переглянути локацію
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className={`${css.navigationButton} ${css.buttonPrev}`}>
            ←
          </button>
          <button className={`${css.navigationButton} ${css.buttonNext}`}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
