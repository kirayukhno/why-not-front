'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ReviewsBlock from '../ReviewsBlock/ReviewsBlock';
import AuthPromptModal from '../AuthPromptModal/AuthPromptModal';
import AddReviewModal from '../AddReviewModal/AddReviewModal';
import styles from './ReviewsSection.module.css';
import type { Review } from '../ReviewsBlock/ReviewsBlock';

type Feedback = {
  _id: string;
  rate: number;
  description?: string;
  userName: string;
};

interface ReviewsSectionProps {
  locationId: string;
  feedbacks: Feedback[];
}

export default function ReviewsSection({ locationId, feedbacks }: ReviewsSectionProps) {
  const locationFeedback: Review[] = feedbacks.map((feedback) => ({
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
    <section className={styles.reviewsSection}>
      <div className={styles.header}>
        <h2>Відгуки</h2>
        <button onClick={handleAddReviewClick} className="primary-btn">
          Залишити відгук
        </button>
      </div>
      <ReviewsBlock reviews={locationFeedback} />
      {isAuthPromptOpen && <AuthPromptModal onClose={() => setIsAuthPromptOpen(false)} />}
      {isAddReviewOpen && <AddReviewModal onClose={() => setIsAddReviewOpen(false)} bookingId={locationId} />}
    </section>
  );
}