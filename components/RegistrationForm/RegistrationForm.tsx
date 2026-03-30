"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import styles from "./RegistrationForm.module.css";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Мінімум 2 символи")
    .max(32, "Максимум 32 символи")
    .required("Ім'я обов'язкове"),
  email: Yup.string()
    .email("Невірний формат email")
    .max(64, "Максимум 64 символи")
    .required("Email обов'язковий"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .max(128, "Максимум 128 символів")
    .required("Пароль обов'язковий"),
});

export default function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") ?? "/";

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message ?? "Помилка реєстрації");
        }

        router.push(redirectTo);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Помилка реєстрації",
        );
      }
    },
  });

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
      <h1 className={styles.title}>Реєстрація</h1>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Ім&apos;я*
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ваше ім'я"
          className={`${styles.input} ${formik.touched.name && formik.errors.name ? styles.inputError : ""}`}
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <span className={styles.error}>{formik.errors.name}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="reg-email">
          Пошта*
        </label>
        <input
          id="reg-email"
          type="email"
          placeholder="hello@relaxmap.ua"
          className={`${styles.input} ${formik.touched.email && formik.errors.email ? styles.inputError : ""}`}
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <span className={styles.error}>{formik.errors.email}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="reg-password">
          Пароль*
        </label>
        <input
          id="reg-password"
          type="password"
          placeholder="••••••••"
          className={`${styles.input} ${formik.touched.password && formik.errors.password ? styles.inputError : ""}`}
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <span className={styles.error}>{formik.errors.password}</span>
        )}
      </div>

      <button
        type="submit"
        className={`primary-btn ${styles.button}`}
        disabled={formik.isSubmitting}
      >
        Зареєструватись
      </button>
    </form>
  );
}
