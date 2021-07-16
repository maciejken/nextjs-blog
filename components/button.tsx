import styles from './button.module.css';

export default function Button({ children, onClick, tabIndex }) {
  return (
    <a
      className={styles.button}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {children}
    </a>
  );
}