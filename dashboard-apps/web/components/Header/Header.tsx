'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDescope } from '@descope/nextjs-sdk/client';

import styles from './Header.module.scss';

const NOTIFICATIONS = [
  { id: 1, text: 'Your claim ID - CLM001 for General Hospital is processed.', type: 'claim', time: '2h ago', unread: true },
  { id: 2, text: 'Mailed ID card: Your new physical ID card has been shipped.', type: 'card', time: '1d ago', unread: true },
  { id: 3, text: 'Prior Authorization Approved: Request for Radiology (MRT) has been granted.', type: 'auth', time: '2d ago', unread: false },
  { id: 4, text: "Wellness Reminder: It's time for your annual preventive check-up.", type: 'wellness', time: '3d ago', unread: false },
];

const ICON_MAP: Record<string, string> = { claim: '📄', card: '🆔', auth: '✅', wellness: '❤️' };
const ICON_BG: Record<string, string>  = { claim: '#e1f5fe', card: '#fff3e0', auth: '#e8f5e9', wellness: '#fce4ec' };

const NAV_MENUS = [
  { id: 'plans',     label: 'Plans',               items: [{ label: 'My Plans', href: '/my-plans' }, { label: 'Deductible & Out of Pocket Tracker', href: undefined }] },
  { id: 'providers', label: 'Find a Provider',      items: [{ label: 'Search Provider', href: '/search-pcp' }] },
  { id: 'claims',    label: 'Claims',               items: [{ label: 'Search a claim', href: '/claims' }, { label: 'Submit a claim', href: undefined }] },
  { id: 'health',    label: 'Health and Wellbeing', items: [{ label: 'Prior Authorizations', href: undefined }, { label: 'Health Actions card', href: undefined }] },
];

const ACCOUNT_ITEMS = [
  { label: 'Member Information', href: '/member-information' },
  { label: 'Access Permission',  href: '/access-permission' },
  { label: 'Preferences',        href: '/preferences' },
  { label: 'Security Details',   href: '/security-details' },
];

export default function Header() {
  const router   = useRouter();
  const pathname = usePathname();
  const { logout } = useDescope();
  const headerRef = useRef<HTMLElement>(null);

  const [openMenu,       setOpenMenu]       = useState<string | null>(null);
  const [showLang,       setShowLang]       = useState(false);
  const [showNotif,      setShowNotif]      = useState(false);
  const [showAccount,    setShowAccount]    = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const closeAll = () => {
    setOpenMenu(null);
    setShowLang(false);
    setShowNotif(false);
    setShowAccount(false);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeAll();
        closeMobile();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggle = (setter: (v: boolean) => void, current: boolean): void => { closeAll(); setter(!current); };

  const handleLogoff = async () => {
    closeAll();
    closeMobile();
    await logout();
    router.replace('/login');
  };

  const toggleMobileSection = (id: string) => {
    setMobileExpanded(prev => (prev === id ? null : id));
  };

  return (
    <header ref={headerRef} className={styles.header}>
      {/* ── Utility Bar (desktop only) ── */}
      <div className={styles.utilityBar}>
        {/* Language */}
        <div style={{ position: 'relative' }}>
          <button className={styles.utilityItem} onClick={() => toggle(setShowLang, showLang)}>
            🌐 Language
          </button>
          {showLang && (
            <div className={`${styles.dropdown} ${styles.langDropdown}`}>
              {['English', 'Español', 'தமிழ்'].map(lang => (
                <button key={lang} className={styles.dropdownItem} onClick={closeAll}>{lang}</button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className={styles.utilityItem} aria-label="Notifications, 2 unread" onClick={() => toggle(setShowNotif, showNotif)}>
            <span className={styles.bellWrap}>
              🔔
              <span className={styles.badge}>2</span>
            </span>
            Notifications
          </button>
          {showNotif && (
            <div className={`${styles.dropdown} ${styles.notifDropdown}`}>
              <div className={styles.notifHeader}>Notifications</div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`${styles.notifItem} ${n.unread ? styles.unread : ''}`}>
                  <div className={styles.notifIcon} style={{ background: ICON_BG[n.type] }}>{ICON_MAP[n.type]}</div>
                  <div className={styles.notifContent}>
                    <p className={`${styles.notifText} ${n.unread ? styles.unread : ''}`}>{n.text}</p>
                    <p className={styles.notifTime}>{n.time}</p>
                  </div>
                  {n.unread && <span className={styles.unreadDot} />}
                </div>
              ))}
              <button className={styles.seeAll} onClick={closeAll}>See all notifications</button>
            </div>
          )}
        </div>

        {/* Account */}
        <div style={{ position: 'relative' }}>
          <button className={styles.utilityItem} style={{ marginLeft: 8 }} aria-label="Account menu" aria-expanded={showAccount} onClick={() => toggle(setShowAccount, showAccount)}>
            <span className={styles.avatar} />
            SARAH J. ▾
          </button>
          {showAccount && (
            <div className={styles.dropdown}>
              {ACCOUNT_ITEMS.map(item => (
                <button key={item.label} className={styles.dropdownItem} onClick={() => { closeAll(); router.push(item.href); }}>
                  {item.label}
                </button>
              ))}
              <button className={`${styles.dropdownItem} ${styles.logoffItem}`} onClick={handleLogoff}>
                Logoff
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Nav ── */}
      <nav className={styles.mainNav}>
        <Link href="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon} aria-hidden="true">🇺🇸</span>
          <div>
            <div className={styles.logoMain}>America</div>
            <div className={styles.logoSub}>Health Insurance</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className={styles.navLinks}>
          <div className={styles.navItem}>
            <Link href="/dashboard" className={`${styles.navLink} ${pathname === '/dashboard' ? styles.active : ''}`}>
              Home
            </Link>
          </div>

          {NAV_MENUS.map(menu => (
            <div key={menu.id} className={styles.navItem}>
              <button
                className={`${styles.navLink} ${openMenu === menu.id ? styles.active : ''}`}
                onClick={() => { const isOpen = openMenu === menu.id; closeAll(); if (!isOpen) setOpenMenu(menu.id); }}
              >
                {menu.label} ▾
              </button>
              {openMenu === menu.id && (
                <div className={styles.navDropdown}>
                  {menu.items.map((item, i) => (
                    <button
                      key={i}
                      className={`${styles.dropdownItem} ${!item.href ? styles.dropdownItemDisabled : ''}`}
                      onClick={() => { if (item.href) { closeAll(); router.push(item.href); } }}
                      disabled={!item.href}
                    >
                      {item.label}
                      {!item.href && <span className={styles.comingSoon}>Soon</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className={styles.navItem}>
            <button className={`${styles.navLink} ${styles.navLinkDisabled}`} disabled>
              Prescriptions <span className={styles.comingSoonInline}>Soon</span>
            </button>
          </div>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => { closeAll(); setMobileOpen(prev => !prev); }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {/* Account row */}
          <div className={styles.mobileAccountRow}>
            <span className={styles.avatar} />
            <span className={styles.mobileAccountName}>SARAH J.</span>
          </div>

          {/* Home */}
          <Link
            href="/dashboard"
            className={`${styles.mobileNavLink} ${pathname === '/dashboard' ? styles.mobileNavLinkActive : ''}`}
            onClick={closeMobile}
          >
            Home
          </Link>

          {/* Nav menus with accordion */}
          {NAV_MENUS.map(menu => (
            <div key={menu.id} className={styles.mobileSection}>
              <button
                className={styles.mobileSectionHeader}
                onClick={() => toggleMobileSection(menu.id)}
              >
                <span>{menu.label}</span>
                <span className={`${styles.mobileChevron} ${mobileExpanded === menu.id ? styles.mobileChevronOpen : ''}`}>›</span>
              </button>
              {mobileExpanded === menu.id && (
                <div className={styles.mobileSectionItems}>
                  {menu.items.map((item, i) => (
                    <button
                      key={i}
                      className={`${styles.mobileSectionItem} ${!item.href ? styles.mobileSectionItemDisabled : ''}`}
                      onClick={() => { if (item.href) { closeMobile(); router.push(item.href); } }}
                      disabled={!item.href}
                    >
                      {item.label}
                      {!item.href && <span className={styles.comingSoon}>Soon</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button className={`${styles.mobileNavLink} ${styles.mobileSectionItemDisabled}`} disabled>
            Prescriptions <span className={styles.comingSoon}>Soon</span>
          </button>

          <div className={styles.mobileDivider} />

          {/* Utility items */}
          <div className={styles.mobileSection}>
            <button
              className={styles.mobileSectionHeader}
              onClick={() => toggleMobileSection('lang')}
            >
              <span>🌐 Language</span>
              <span className={`${styles.mobileChevron} ${mobileExpanded === 'lang' ? styles.mobileChevronOpen : ''}`}>›</span>
            </button>
            {mobileExpanded === 'lang' && (
              <div className={styles.mobileSectionItems}>
                {['English', 'Español', 'தமிழ்'].map(lang => (
                  <button key={lang} className={styles.mobileSectionItem} onClick={closeMobile}>{lang}</button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.mobileSection}>
            <button
              className={styles.mobileSectionHeader}
              onClick={() => toggleMobileSection('notif')}
            >
              <span>
                🔔 Notifications
                <span className={styles.mobileBadge}>2</span>
              </span>
              <span className={`${styles.mobileChevron} ${mobileExpanded === 'notif' ? styles.mobileChevronOpen : ''}`}>›</span>
            </button>
            {mobileExpanded === 'notif' && (
              <div className={styles.mobileSectionItems}>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={styles.mobileNotifItem}>
                    <div className={styles.mobileNotifIcon} style={{ background: ICON_BG[n.type] }}>{ICON_MAP[n.type]}</div>
                    <div>
                      <p className={styles.mobileNotifText}>{n.text}</p>
                      <p className={styles.mobileNotifTime}>{n.time}</p>
                    </div>
                    {n.unread && <span className={styles.unreadDot} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.mobileDivider} />

          {/* Account links */}
          {ACCOUNT_ITEMS.map(item => (
            <button
              key={item.label}
              className={styles.mobileNavLink}
              onClick={() => { closeMobile(); router.push(item.href); }}
            >
              {item.label}
            </button>
          ))}

          <button className={`${styles.mobileNavLink} ${styles.mobileLogoff}`} onClick={handleLogoff}>
            Logoff
          </button>
        </div>
      )}
    </header>
  );
}
