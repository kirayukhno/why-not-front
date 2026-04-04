"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { login, type LoginData } from "@/lib/api/clientApi";
import styles from "./LoginForm.module.css";

const initialValues: LoginData = {
  email: "",
  password: "",
};

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

  const handleSubmit = async (
    values: LoginData,
    actions: FormikHelpers<LoginData>,
  ) => {
    try {
      await login(values);
      router.push(redirectTo);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Помилка входу");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form} noValidate>
          <h1 className={styles.title}>Вхід</h1>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Пошта*
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="hello@relaxmap.ua"
              className={styles.input}
            />
            <ErrorMessage
              name="email"
              component="span"
              className={styles.error}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Пароль*
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className={styles.input}
            />
            <ErrorMessage
              name="password"
              component="span"
              className={styles.error}
            />
          </div>

          <button
            type="submit"
            className={`primary-btn ${styles.button}`}
            disabled={isSubmitting}
          >
            Увійти
          </button>
        </Form>
      )}
    </Formik>
  );
}
