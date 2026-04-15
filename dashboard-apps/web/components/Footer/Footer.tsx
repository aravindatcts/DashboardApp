import styles from './Footer.module.scss';

const LINKS: Record<string, string[]> = {
  'Member Services': ['Find a Doctor', 'View My ID Card', 'Request New ID Card', 'Check Benefits'],
  'Claims':          ['Search Claims', 'Submit a Claim', 'Claim Status', 'EOB Documents'],
  'Resources':       ['Health Library', 'Wellness Programs', 'Prior Authorization', 'Forms & Documents'],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <div className={styles.logoWrap}>
            <span className={styles.logoIcon}>🇺🇸</span>
            <div>
              <div className={styles.logoMain}>America</div>
              <div className={styles.logoSub}>Health Insurance</div>
            </div>
          </div>
          <p className={styles.tagline}>
            Committed to your health and wellbeing. Quality care, every step of the way.
          </p>
        </div>

        {Object.entries(LINKS).map(([title, items]) => (
          <div key={title}>
            <p className={styles.colTitle}>{title}</p>
            <ul className={styles.colLinks}>
              {items.map(item => (
                <li key={item}>
                  <button className={styles.colLink}>{item}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>© {new Date().getFullYear()} America Health Insurance. All rights reserved.</p>
        <div className={styles.bottomLinks}>
          {['Privacy Policy', 'Terms of Use', 'Accessibility', 'Contact Us'].map(l => (
            <button key={l} className={styles.bottomLink}>{l}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}
