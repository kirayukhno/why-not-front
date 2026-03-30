import styles from "./LoginForm.module.css";

export default function LoginForm() {
  return (
    <form className={styles.form}>
      <h1 className={styles.title}>Вхід</h1>

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
        Увійти
      </button>
    </form>
  );
}
