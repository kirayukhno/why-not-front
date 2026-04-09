'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import css from './AddReviewForm.module.css';
import { useAuth } from '@/hooks/useAuth';

interface AddReviewFormProps {
  locationId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

interface ReviewFormValues {
  description: string;
  rate: number;
}

interface CreateReviewPayload {
  locationId: string;
  description: string;
  rate: number;
}

interface CreateReviewResponse {
  message?: string;
}

type StarVariant = 'empty' | 'selected';

interface StarIconProps {
  variant: StarVariant;
}

const initialValues: ReviewFormValues = {
  description: '',
  rate: 0,
};

const reviewSchema = Yup.object({
  description: Yup.string()
    .trim()
    .min(1, 'Мінімум 1 символ')
    .max(200, 'Максимум 200 символів')
    .required('Введіть відгук'),
  rate: Yup.number()
    .min(1, 'Оберіть рейтинг')
    .max(5, 'Максимум 5 зірок')
    .required('Оберіть рейтинг'),
});

function StarIcon({ variant }: StarIconProps) {
  if (variant === 'selected') {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.008 21.885l-5.639 4.296c-0.227 0.171-0.456 0.246-0.688 0.224s-0.447-0.097-0.646-0.224c-0.199-0.127-0.341-0.299-0.427-0.518s-0.093-0.463-0.021-0.734l2.152-7.007-5.531-3.979c-0.227-0.154-0.373-0.349-0.439-0.584s-0.061-0.457 0.017-0.667c0.077-0.204 0.203-0.388 0.377-0.551s0.405-0.245 0.692-0.245h6.858l2.193-7.307c0.072-0.276 0.215-0.483 0.427-0.622s0.435-0.207 0.667-0.207 0.454 0.069 0.667 0.207c0.213 0.138 0.358 0.345 0.435 0.622l2.185 7.307h6.866c0.282 0 0.509 0.082 0.684 0.245s0.3 0.347 0.377 0.551c0.077 0.21 0.083 0.432 0.017 0.667s-0.212 0.43-0.439 0.584l-5.531 3.979 2.152 6.999c0.072 0.276 0.065 0.522-0.021 0.738s-0.228 0.387-0.427 0.514c-0.199 0.132-0.413 0.209-0.643 0.232s-0.457-0.055-0.684-0.232l-5.631-4.289z" fill="black" />
      </svg>
    );
  }

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.4333 22.5664L16 19.0998L20.5666 22.5664L18.7333 16.7998L22.9333 14.0664H17.9L16 8.29977L14.1 14.0664H9.06663L13.2666 16.7998L11.4333 22.5664ZM16.008 21.8844L10.369 26.1808C10.1423 26.3523 9.91297 26.427 9.68097 26.4048C9.44919 26.3825 9.23375 26.3079 9.03463 26.1808C8.83575 26.0539 8.69341 25.8813 8.60763 25.6631C8.52186 25.4451 8.51497 25.2005 8.58697 24.9294L10.739 17.9221L5.20797 13.9431C4.9813 13.7887 4.83497 13.5939 4.76897 13.3588C4.70274 13.1239 4.7083 12.9015 4.78563 12.6918C4.86274 12.4875 4.98841 12.3039 5.16263 12.1408C5.33686 11.9777 5.56741 11.8961 5.8543 11.8961H12.7123L14.9056 4.58877C14.9776 4.31254 15.1201 4.10532 15.333 3.9671C15.5459 3.82888 15.7682 3.75977 16 3.75977C16.2317 3.75977 16.4541 3.82888 16.667 3.9671C16.8799 4.10532 17.025 4.31254 17.1023 4.58877L19.2876 11.8961H26.1536C26.4352 11.8961 26.6631 11.9777 26.8373 12.1408C27.0115 12.3039 27.1372 12.4875 27.2143 12.6918C27.2916 12.9015 27.2972 13.1239 27.231 13.3588C27.165 13.5939 27.0186 13.7887 26.792 13.9431L21.261 17.9221L23.413 24.9214C23.485 25.1979 23.4781 25.4438 23.3923 25.6591C23.3065 25.8747 23.1642 26.046 22.9653 26.1731C22.7662 26.3053 22.552 26.3825 22.3226 26.4048C22.0935 26.427 21.8656 26.3498 21.639 26.1731L16.008 21.8844Z" fill="black" />
    </svg>
  );
}

async function createReview(payload: CreateReviewPayload): Promise<CreateReviewResponse> {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Не вдалося надіслати відгук');
  }

  return {
    message: data?.message || 'Відгук успішно надіслано',
  };
}

export default function AddReviewForm({ locationId, onCancel, onSuccess }: AddReviewFormProps) {
  const [serverError, setServerError] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user } = useAuth();

  const handleSubmit = async (
    values: ReviewFormValues,
    actions: FormikHelpers<ReviewFormValues>,
  ): Promise<void> => {
    if (!user) {
      setServerError('Потрібно увійти, щоб залишити відгук.');
      actions.setSubmitting(false);
      return;
    }

    setServerError('');

    try {
      await createReview({
        locationId,
        description: values.description.trim(),
        rate: values.rate,
      });

      actions.resetForm();
      onSuccess();
    } catch (error: unknown) {
      setServerError(error instanceof Error ? error.message : 'Сталася помилка. Спробуйте ще раз.');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik<ReviewFormValues>
      initialValues={initialValues}
      validationSchema={reviewSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting, touched, errors }) => (
        <Form className={css.form}>
          <div>
            <label htmlFor="description" className={css.label}>
              Ваш відгук
            </label>

            <Field
              as="textarea"
              id="description"
              name="description"
              className={`${css.textarea} ${
                touched.description && errors.description ? css.textareaError : ''
              }`}
              placeholder="Напишіть ваш відгук"
            />

            <ErrorMessage name="description" component="p" className={css.errorText} />
          </div>

          <div>
            <div className={css.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={css.starBtn}
                  onClick={() => setFieldValue('rate', star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  aria-label={`Оцінка ${star}`}
                >
                  <StarIcon
                    variant={
                      (hoveredRating || values.rate) >= star ? 'selected' : 'empty'
                    }
                  />
                </button>
              ))}
            </div>

            <ErrorMessage name="rate" component="p" className={css.errorText} />
          </div>

          {serverError && <p className={css.errorText}>{serverError}</p>}

          <div className={css.actions}>
            <button type="button" className={css.cancelBtn} onClick={onCancel} disabled={isSubmitting}>
              Відмінити
            </button>

            <button type="submit" className={css.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Надсилання...' : 'Надіслати'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
