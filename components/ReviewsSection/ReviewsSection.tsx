'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ReviewsBlock from '../ReviewsBlock/ReviewsBlock';
import AuthPromptModal from '../AuthPromptModal/AuthPromptModal';
import AddReviewModal from '../AddReviewModal/AddReviewModal';
import styles from './ReviewsSection.module.css';
import type { Feedback } from '@/types/types';

type ReviewCardData = Omit<Feedback, '_id'> & {
  id: string;
  _id: string;
};

interface ReviewsSectionProps {
  locationId: string;
  feedbacks: Feedback[];
}

export default function ReviewsSection({
  locationId,
  feedbacks,
}: ReviewsSectionProps) {
  const locationFeedback: ReviewCardData[] = feedbacks.map((feedback) => ({
    _id: feedback._id,
    id: feedback._id,
    locationId,
    userName: feedback.userName,
    rate: feedback.rate,
    description: feedback.description ?? '',
    locationType: '',
  }));

  const { isAuthenticated } = useAuth();
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const handleAddReviewClick = () => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
    } else {
      setIsAddReviewOpen(true);
    }
  };

  return (
    <section className={styles.reviews}>
      <div className={styles.header}>
        <h2 className={styles.title}>Відгуки</h2>
        <button onClick={handleAddReviewClick} className={styles.button + " primary-btn"}>
          Залишити відгук
        </button>
      </div>
      <ReviewsBlock reviews={locationFeedback} />
      {isAuthPromptOpen && <AuthPromptModal onClose={() => setIsAuthPromptOpen(false)} />}
      {isAddReviewOpen && <AddReviewModal onClose={() => setIsAddReviewOpen(false)} locationId={locationId} />}
    </section>
  );
}
