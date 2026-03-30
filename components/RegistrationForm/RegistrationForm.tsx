import styles from "./RegistrationForm.module.css";

export default function RegistrationForm() {
  return (
    <form className={styles.form}>
      <h1 className={styles.title}>Реєстрація</h1>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Ім&apos;я*
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ваше ім'я"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Пошта*
        </label>
        <input
          id="email"
          type="email"
          placeholder="hello@relaxmap.ua"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Пароль*
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className={styles.input}
        />
      </div>

      <button type="submit" className={`primary-btn ${styles.button}`}>
        Зареєструватись
      </button>
    </form>
  );
}
