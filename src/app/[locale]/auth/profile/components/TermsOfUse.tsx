import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { IconCheck } from '@tabler/icons-react';
import { terms } from '../constant';
import styles from '../Profile.module.scss';

function TermsOfUse() {
  const t = useTranslations();

  return (
    <div className={clsx(styles['terms'])}>
      <ol>
        {terms.map((term, index) => (
          <li key={index} className={clsx(styles['terms__item'])}>
            <span>
              <IconCheck size={14} color="var(--primary-color)" />
            </span>
            <p>
              <b>{t(term.title)}:</b> {t(term.content)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default TermsOfUse;
