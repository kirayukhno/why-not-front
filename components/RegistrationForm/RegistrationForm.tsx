"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { register, type RegisterData } from "@/lib/api/clientApi";
import styles from "./RegistrationForm.module.css";

const initialValues: RegisterData = {
  name: "",
  email: "",
  password: "",
};

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

  const handleSubmit = async (
    values: RegisterData,
    actions: FormikHelpers<RegisterData>,
  ) => {
    try {
      await register(values);
      router.push(redirectTo);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Помилка реєстрації",
      );
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
          <h1 className={styles.title}>Реєстрація</h1>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Ім&apos;я*
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Ваше ім'я"
              className={styles.input}
            />
            <ErrorMessage
              name="name"
              component="span"
              className={styles.error}
            />
          </div>

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
            <label className={styles.label} htmlFor="reg-password">
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
            Зареєструватись
          </button>
        </Form>
      )}
    </Formik>
  );
}
