// Self-contained MoreVision footer logo strip.
// Independent component — brings its own styles + asset, and does not depend on
// or affect any existing site component. Both the logo and the copyright text
// link to https://morevision.ai (as in the source element).
import Image from 'next/image';

import logo from './morevision-logo-wide-light.png';
import styles from './MoreVisionStrip.module.css';

const MOREVISION_URL = 'https://morevision.ai';

export default function MoreVisionStrip() {
  return (
    <section className={styles.strip} aria-label="MoreVision">
      <div className={styles.inner}>
        <a
          href={MOREVISION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoLink}
          aria-label="MoreVision"
        >
          {/* The source PNG is 1024px wide but renders ~150px; `sizes` keeps the
              generated srcset down to what the strip actually needs. */}
          <Image src={logo} alt="MoreVision" className={styles.logo} sizes="160px" />
        </a>

        <a
          href={MOREVISION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.copy}
        >
          © MoreVision | All Rights Reserved
        </a>
      </div>
    </section>
  );
}
