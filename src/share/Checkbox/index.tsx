import clsx from 'clsx';
import styles from './Checkbox.module.scss';

const Checkbox = ({ checkLabel, onChange }: { checkLabel?: string; onChange?: () => void }) => {
  return (
    <label onChange={onChange} className={clsx(styles['form__checkbox'], !checkLabel && styles.noLabel)}>
      <input type="checkbox" name="" className={clsx(styles['form__checkbox-input'])} />
      {checkLabel && <span className={clsx(styles['form__checkbox-label'])}>{checkLabel}</span>}
    </label>
  );
};

export default Checkbox;
