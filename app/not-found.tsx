import Link from "next/link";
import styles from "./shell.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.center}>
        <h1 className={styles.wordmark}>
          No <em>page</em>
        </h1>
        <p className={styles.pitch}>
          There is nothing published at this address.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.cta}>
            Leaflet
          </Link>
        </div>
      </div>
    </main>
  );
}
