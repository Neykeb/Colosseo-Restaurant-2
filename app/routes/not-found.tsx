import { Link } from "react-router";

export function meta() {
  return [{ title: "Seite nicht gefunden | Ristorante Colosseo" }];
}

export default function NotFoundRoute() {
  return (
    <main className="not-found" id="main-content">
      <p>404</p>
      <h1>Diese Seite gibt es nicht.</h1>
      <Link className="button button-primary" to="/de">
        Zur Startseite
      </Link>
    </main>
  );
}
