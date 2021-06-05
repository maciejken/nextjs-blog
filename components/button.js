import styles from './button.module.css';

export default function Button({ children, onClick }) {
  return (
    <a className={styles.button} onClick={onClick}>{children}</a>
  );
}