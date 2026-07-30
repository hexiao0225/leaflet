import styles from "./workstation.module.css";

/**
 * The landing-page hero: a 2000s LCD sitting on a rack server, drawn in CSS.
 * `children` is rendered inside the glass, so the screen shows a real page
 * rather than a picture of one.
 */
export default function Workstation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.monitor}>
        <span className={styles.brandTop}>FLATRON L1715S</span>

        <div className={styles.bezel}>
          <div className={styles.screen}>
            <div className={styles.screenInner}>{children}</div>
          </div>
        </div>

        <div className={styles.chin}>
          <span className={styles.logo}>LG</span>
          <span className={styles.buttons}>
            <i />
            <i />
            <i />
            <i className={styles.power} />
          </span>
        </div>
      </div>

      <div className={styles.neck} />
      <div className={styles.base} />

      <div className={styles.server}>
        <div className={styles.lid} />
        <div className={styles.face}>
          <div className={styles.slots}>
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className={styles.ports}>
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className={styles.psu}>
            <span className={styles.led} />
            <span className={styles.grille} />
            <span className={styles.plug} />
          </div>
          <div className={styles.psu}>
            <span className={styles.led} />
            <span className={styles.grille} />
            <span className={styles.plug} />
          </div>
        </div>
      </div>

      <div className={styles.cables}>
        <i style={{ left: "31%", rotate: "4deg" }} />
        <i style={{ left: "58%", rotate: "-3deg" }} />
        <i style={{ left: "66%", rotate: "6deg" }} />
        <i style={{ left: "79%", rotate: "-5deg" }} />
      </div>
    </div>
  );
}
