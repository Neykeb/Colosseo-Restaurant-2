import { Link } from "@tanstack/react-router";

type Props = {
  href: string;
};

export function BrandMark({ href }: Props) {
  return (
    <Link className="wordmark" to={href}>
      <span>Ristorante</span>
      Colosseo
    </Link>
  );
}