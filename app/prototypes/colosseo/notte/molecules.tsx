import { ReviewStars } from "./atoms";

type Review = {
  author: string;
  quote: string;
  rating: number;
  date: string;
};

const reviewDateTranslations: Record<"en" | "it", Record<string, string>> = {
  en: { "vor 3 Monaten": "3 months ago", "vor 4 Monaten": "4 months ago", "vor 5 Monaten": "5 months ago", "vor 7 Monaten": "7 months ago", "vor 8 Monaten": "8 months ago", "vor 9 Monaten": "9 months ago", "vor 10 Monaten": "10 months ago", "vor 11 Monaten": "11 months ago", "vor einem Jahr": "one year ago" },
  it: { "vor 3 Monaten": "3 mesi fa", "vor 4 Monaten": "4 mesi fa", "vor 5 Monaten": "5 mesi fa", "vor 7 Monaten": "7 mesi fa", "vor 8 Monaten": "8 mesi fa", "vor 9 Monaten": "9 mesi fa", "vor 10 Monaten": "10 mesi fa", "vor 11 Monaten": "11 mesi fa", "vor einem Jahr": "un anno fa" },
};

export function ReviewCard({ duplicate, locale, review }: { duplicate: boolean; locale: "de" | "en" | "it"; review: Review }) {
  const date = locale === "de" ? review.date : reviewDateTranslations[locale][review.date] ?? review.date;
  return <figure className="no-review-card" tabIndex={duplicate ? -1 : 0}>
    <ReviewStars locale={locale} rating={review.rating} />
    <blockquote>„{review.quote}“</blockquote>
    <figcaption><strong>{review.author}</strong><span>{date}</span></figcaption>
  </figure>;
}
