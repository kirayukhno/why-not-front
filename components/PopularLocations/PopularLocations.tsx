import css from "./PopularLocations.module.css";

export default function PopularLocations() {
  return (
    <section className={css.popularLocations}>
      <div className={css.popularLocationsWrap}>
        <div className={css.popularLocationsHeader}>
          <h2 className={css.title}>Популярні локації</h2>
          <button className={css.button + " primary-btn"}>Всі локації</button>
        </div>
        <div>Блок пагінації</div>
      </div>
    </section>
  );
}
