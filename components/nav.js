import ActiveLink from './active-link';
import styles from './nav.module.css';

export default function Nav({ links }) {
  return (
    <nav className={styles.nav}>
      {links.map(linkItem => (
        <ActiveLink
          activeClassName={styles.active}
          href={linkItem.href}
          key={`nav-link-${linkItem.tabIndex}`}
        >
          <a
            className={styles.navLink}
            tabIndex={linkItem.tabIndex}
          >
            {linkItem.text}
          </a>
        </ActiveLink>        
      ))}
    </nav>
  );
}