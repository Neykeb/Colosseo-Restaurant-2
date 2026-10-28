export function MaskedWords({ text }: { text: string }) {
  return <>{text.split(" ").map((word, index) => <span className="no-word" key={`${word}-${index}`}><span className="no-word-inner">{word}</span>{" "}</span>)}</>;
}

export function ReviewStars({ rating }: { rating: number }) {
  return <span className="no-review-stars" aria-label={`${rating} von 5 Sternen`} role="img">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
}
