import css from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={css.hero}>
      <div className={css.heroWrap}>
        <h1 className={css.heroTitle}>
          Відкрий для себе Україну. Знайди ідеальне місце для відпочинку
        </h1>
        <p className={css.heroSubtitle}>
          Тисячі перевірених локацій з реальними фото та відгуками від
          мандрівників.
        </p>
        <div className={css.heroSearch}>
          <input
            className={css.regionInput}
            type="text"
            placeholder="Введіть назву, тип або регіон..."
          />
          <button className={css.button + " primary-btn"}>Знайти місце</button>
        </div>
      </div>
    </section>
  );
}
