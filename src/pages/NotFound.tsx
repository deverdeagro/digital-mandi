import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <h1>Page not found</h1>
      <p>This Digital Mandi page does not exist.</p>
      <Link className="button-primary" to="/">Go to home</Link>
    </main>
  );
}
