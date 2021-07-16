import styles from './radio-group.module.css';

export default function RadioGroup({ onChange, name, options, value }) {
  return (
    <div>
      {options.map((option, index) => (
        <label key={`${name}-radio-group-${index}`} className={styles.radioLabel}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className={styles.radioInput}
          />
          {option.label}
        </label>          
      ))}
    </div>
  );
}
