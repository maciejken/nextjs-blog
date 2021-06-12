import styles from './select.module.css';

export default function Select({ onChange, name, options, tabIndex, value }) {
  return (
    <select
      name={name}
      onChange={onChange}
      className={styles.select}
      tabIndex={tabIndex}
      value={value}
    >
      {options.map(optn =>
        <option value={optn.value} key={`select-option-${optn.value}`}>
          {optn.label}
        </option>
      )}
    </select>
  );
}