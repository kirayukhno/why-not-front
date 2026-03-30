"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import styles from "./LoginForm.module.css";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Невірний формат email")
    .max(64, "Максимум 64 символи")
    .required("Email обов'язковий"),
  password: Yup.string()
    .min(8, "Мінімум 8 символів")
    .max(128, "Максимум 128 символів")
    .required("Пароль обов'язковий"),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") ?? "/";

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message ?? "Помилка входу");
        }

        router.push(redirectTo);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Помилка входу");
      }
    },
  });

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
      <h1 className={styles.title}>Вхід</h1>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Пошта*
        </label>
        <input
          id="email"
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
        <label className={styles.label} htmlFor="password">
          Пароль*
        </label>
        <input
          id="password"
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
        Увійти
      </button>
    </form>
  );
}
