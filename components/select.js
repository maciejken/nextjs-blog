import styles from './select.module.css';

export default function Select({ onChange, name, options, value }) {
  return (
    <select name={name} onChange={onChange} className={styles.select} value={value}>
      {options.map(optn =>
        <option value={optn.value} key={`select-option-${optn.value}`}>
          {optn.label}
        </option>
      )}
    </select>
  );
}