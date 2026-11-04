export function MaskedWords({ text }: { text: string }) {
  return <>{text.split(" ").map((word, index) => <span className="no-word" key={`${word}-${index}`}><span className="no-word-inner">{word}</span>{" "}</span>)}</>;
}

export function ReviewStars({ locale, rating }: { locale: "de" | "en" | "it"; rating: number }) {
  const label = locale === "de" ? `${rating} von 5 Sternen` : locale === "en" ? `${rating} out of 5 stars` : `${rating} stelle su 5`;
  return <span className="no-review-stars" aria-label={label} role="img">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
}
