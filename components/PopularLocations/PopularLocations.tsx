"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { usePopularLocations } from "@/lib/api/locations";
import css from "./PopularLocations.module.css";
import "swiper/css";

// Утиліта для відображення рейтингу
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

// Компонент Loader
const Loader = () => (
  <div className={css.loader}>
    <div className={css.spinner}></div>
    <p>Завантаження локацій...</p>
  </div>
);

// Компонент Error
const ErrorMessage = ({ message }: { message: string }) => (
  <div className={css.error}>
    <p>❌ {message}</p>
  </div>
);

export default function PopularLocations() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const { data: locations, isLoading, isError, error } = usePopularLocations(6);

  const handlePrevClick = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef.current?.slideNext();
  };

  if (isLoading) {
    return (
      <section className={css.popularLocations}>
        <div className={css.popularLocationsWrap}>
          <div className={css.popularLocationsHeader}>
            <h2 className={css.title}>Популярні локації</h2>
            <button className={css.button + " primary-btn"}>Всі локації</button>
          </div>
          <Loader />
        </div>
      </section>
    );
  }

  if (isError || !locations) {
    return (
      <section className={css.popularLocations}>
        <div className={css.popularLocationsWrap}>
          <div className={css.popularLocationsHeader}>
            <h2 className={css.title}>Популярні локації</h2>
            <button className={css.button + " primary-btn"}>Всі локації</button>
          </div>
          <ErrorMessage
            message={
              error instanceof Error
                ? error.message
                : "Не вдалося завантажити локації"
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className={css.popularLocations}>
      <div className={css.popularLocationsWrap}>
        <div className={css.popularLocationsHeader}>
          <h2 className={css.title}>Популярні локації</h2>
          <button className={css.button + " primary-btn"}>Всі локації</button>
        </div>

        <div className={css.swiperContainer}>
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              375: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1440: { slidesPerView: 3, spaceBetween: 32 },
            }}
            className={css.swiper}
          >
            {locations.map((location) => (
              <SwiperSlide key={location._id} className={css.slide}>
                <div className={css.locationCard}>
                  <img
                    src={location.image}
                    alt={location.name}
                    className={css.cardImage}
                  />
                  <div className={css.cardContent}>
                    <p className={css.category}>{location.locationType}</p>
                    {renderStars(location.rate)}
                    <h3 className={css.cardTitle}>{location.name}</h3>
                    <button className={css.cardButton}>
                      Переглянути локацію
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            onClick={handlePrevClick}
            className={`${css.navigationButton} ${css.buttonPrev}`}
            aria-label="Попередня локація"
          >
            ←
          </button>
          <button
            onClick={handleNextClick}
            className={`${css.navigationButton} ${css.buttonNext}`}
            aria-label="Наступна локація"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
