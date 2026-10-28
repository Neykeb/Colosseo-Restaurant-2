import { ReviewStars } from "./atoms";

type Review = {
  author: string;
  quote: string;
  rating: number;
  date: string;
};

export function ReviewCard({ duplicate, review }: { duplicate: boolean; review: Review }) {
  return <figure className="no-review-card" tabIndex={duplicate ? -1 : 0}>
    <ReviewStars rating={review.rating} />
    <blockquote>„{review.quote}“</blockquote>
    <figcaption><strong>{review.author}</strong><span>{review.date}</span></figcaption>
  </figure>;
}
