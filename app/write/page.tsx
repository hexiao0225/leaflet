import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthor, isAuthConfigured } from "@/lib/auth0";
import Editor from "./Editor";
import styles from "../page.module.css";

export const dynamic = "force-dynamic";

export default async function WritePage() {
  const author = await getAuthor();

  if (!author) {
    if (isAuthConfigured()) redirect("/auth/login?returnTo=/write");

    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <h1 className={styles.wordmark}>Not yet</h1>
          <p className={styles.notice}>
            The editor is gated behind Auth0, which is not configured yet. Run{" "}
            <strong>stripe projects add auth0/client</strong>, redeploy, and this
            page will ask you to sign in.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.ghost}>
              Back
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <Editor authorName={author.name} />;
}
