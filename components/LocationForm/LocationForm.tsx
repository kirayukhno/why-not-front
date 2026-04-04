'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import css from './LocationForm.module.css';
import { createLocation, updateLocation } from '@/lib/api/clientApi';

type LocationFormValues = {
  name: string;
  type: string;
  region: string;
  description: string;
  image: File | null;
};

type LocationInitialData = {
  _id: string;
  name: string;
  type: string;
  region: string;
  description: string;
  image?: string;
};

type LocationFormProps = {
  mode?: 'create' | 'edit';
  locationId?: string;
  initialData?: LocationInitialData;
};

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Мінімум 3 символи')
    .max(96, 'Максимум 96 символів')
    .required("Це поле є обов'язковим"),
  type: Yup.string()
    .max(64, 'Максимум 64 символи')
    .required("Це поле є обов'язковим"),
  region: Yup.string()
    .max(64, 'Максимум 64 символи')
    .required("Це поле є обов'язковим"),
  description: Yup.string()
    .min(20, 'Мінімум 20 символів')
    .max(6000, 'Максимум 6000 символів')
    .required("Це поле є обов'язковим"),
image: Yup.mixed<File>()
  .nullable()
  .test(
    'fileValidation',
    'Фото має бути JPG/PNG і менше 1MB',
    (value) => {
      if (!value) return true;
      const validType = ['image/jpeg', 'image/png'].includes(value.type);
      const validSize = value.size <= 1024 * 1024;
      return validType && validSize;
    }
  ),
});

const typeOptions = [
  { value: '', label: 'Оберіть тип місця' },
  { value: 'beach', label: 'Пляж' },
  { value: 'mountains', label: 'Гори' },
  { value: 'forest', label: 'Ліс' },
  { value: 'camping', label: 'Кемпінг' },
];

const regionOptions = [
  { value: '', label: 'Оберіть регіон' },
  { value: 'Odesa', label: 'Одеська область' },
  { value: 'Lviv', label: 'Львівська область' },
  { value: 'Kyiv', label: 'Київська область' },
  { value: 'Zakarpattia', label: 'Закарпатська область' },
];

export default function LocationForm({
  mode = 'create',
  locationId,
  initialData,
}: LocationFormProps) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(
    initialData?.image || null
  );

  const initialValues: LocationFormValues = {
    name: initialData?.name || '',
    type: initialData?.type || '',
    region: initialData?.region || '',
    description: initialData?.description || '',
    image: null,
  };

  const handleSubmit = async (
    values: LocationFormValues,
    { setSubmitting }: FormikHelpers<LocationFormValues>
  ) => {
    try {
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('type', values.type);
      formData.append('region', values.region);
      formData.append('description', values.description);

      if (values.image) {
        formData.append('images', values.image);
      }

      const data =
        mode === 'edit' && locationId
          ? await updateLocation(locationId, formData)
          : await createLocation(formData);

      toast.success(
        mode === 'edit'
          ? 'Локацію успішно оновлено'
          : 'Локацію успішно створено'
      );

      router.push(`/locations/${data.data._id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Сталася помилка';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ setFieldValue, resetForm, isSubmitting, touched, errors }) => (
        <Form className={css.form}>
          <div className={css.fieldGroup}>
            <label className={css.label} htmlFor="image">
              Фото локації
            </label>

            <div className={css.previewWrapper}>
              {preview ? (
                <img
                  src={preview}
                  alt="Попередній перегляд"
                  className={css.previewImage}
                />
              ) : (
                <div className={css.placeholder}>
                  <span>Оберіть зображення</span>
                </div>
              )}
            </div>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/png, image/jpeg"
              className={css.fileInput}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] || null;
                setFieldValue('image', file);

                if (file) {
                  const objectUrl = URL.createObjectURL(file);
                  setPreview(objectUrl);
                }
              }}
            />

            {touched.image && errors.image ? (
              <p className={css.error}>{errors.image as string}</p>
            ) : null}
          </div>

          <div className={css.fieldGroup}>
            <label className={css.label} htmlFor="name">
              Назва місця
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="Введіть назву"
              className={css.input}
            />
            <ErrorMessage name="name" component="p" className={css.error} />
          </div>

          <div className={css.fieldGroup}>
            <label className={css.label} htmlFor="type">
              Тип місця
            </label>
            <Field as="select" id="type" name="type" className={css.select}>
              {typeOptions.map((option) => (
                <option key={option.value || 'empty-type'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="type" component="p" className={css.error} />
          </div>

          <div className={css.fieldGroup}>
            <label className={css.label} htmlFor="region">
              Регіон
            </label>
            <Field
              as="select"
              id="region"
              name="region"
              className={css.select}
            >
              {regionOptions.map((option) => (
                <option
                  key={option.value || 'empty-region'}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage name="region" component="p" className={css.error} />
          </div>

          <div className={css.fieldGroup}>
            <label className={css.label} htmlFor="description">
              Детальний опис
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              placeholder="Введіть опис місця"
              className={css.textarea}
            />
            <ErrorMessage
              name="description"
              component="p"
              className={css.error}
            />
          </div>

          <div className={css.actions}>
            <button
              type="submit"
              className="primary-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Збереження...'
                : mode === 'edit'
                  ? 'Зберегти зміни'
                  : 'Опублікувати'}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                resetForm();
                setPreview(initialData?.image || null);
              }}
              disabled={isSubmitting}
            >
              Відмінити
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}