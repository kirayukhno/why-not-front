'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import css from './LocationForm.module.css';
import { clientLocationService } from '@/lib/api/clientApi';

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

  image: Yup.mixed<File | null>().test(
    'fileValidation',
    'Фото має бути JPG/PNG і менше 1MB',
    value => {
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

function PlaceholderIcon() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="160" height="160" rx="16" fill="#C9C9C9" />
      <circle cx="61" cy="50" r="13" fill="#E2E2E2" />
      <path
        d="M102.585 61.4888C101.005 59.6157 98.113 59.6713 96.606 61.6036L78.1683 85.2506C76.5408 87.3382 73.3494 87.1849 71.9301 84.9507L65.5868 74.9666C64.0417 72.5336 60.4966 72.5514 58.9761 75L35.3325 113.065C33.7265 115.651 35.5864 119 38.6321 119H118.731C121.849 119 123.688 115.503 121.938 112.923L102.585 61.4888Z"
        fill="#E2E2E2"
      />
    </svg>
  );
}

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
          ? await clientLocationService.updateLocation(locationId, formData)
          : await clientLocationService.createLocation(formData);

      toast.success(
        mode === 'edit'
          ? 'Локацію успішно оновлено'
          : 'Локацію успішно створено'
      );

      router.push(`/locations/${data.data._id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Сталася помилка');
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
              Обкладинка
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
                  <PlaceholderIcon />
                </div>
              )}
            </div>

            <label className={css.uploadBtn} htmlFor="image">
              Завантажити фото
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/png, image/jpeg"
              className={css.fileInput}
              onChange={event => {
                const file = event.currentTarget.files?.[0] || null;
                setFieldValue('image', file);

                if (file) {
                  const objectUrl = URL.createObjectURL(file);
                  setPreview(objectUrl);
                } else {
                  setPreview(initialData?.image || null);
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
              placeholder="Введіть назву місця"
              className={css.input}
            />

            <ErrorMessage name="name" component="p" className={css.error} />
          </div>

          <div className={css.fieldGroup}>
            <label className={css.label} htmlFor="type">
              Тип місця
            </label>

            <Field as="select" id="type" name="type" className={css.select}>
              {typeOptions.map(option => (
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
              {regionOptions.map(option => (
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
              placeholder="Детальний опис локації"
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
              className={css.submitBtn}
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
              className={css.cancelBtn}
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