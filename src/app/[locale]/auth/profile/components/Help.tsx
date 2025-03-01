import { useTranslations } from 'next-intl';
import styles from '../Profile.module.scss';
import { getHelpSections } from '../constant';
import { Link } from '@/i18n/routing';

function Help() {
  const t = useTranslations();
  const helpSections = getHelpSections(t);

  const renderLink = (link?: string, content?: string, external?: boolean) => {
    if (!link) return content;
    return external ? (
      <a href={link} className={styles.help__link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <Link href={link} className={styles.help__link}>
        {content}
      </Link>
    );
  };

  return (
    <div className={styles.help}>
      <h3 className={styles.help__title}>{t('help.title01')}</h3>
      <p className={styles.help__item}>{t('help.content01')}</p>

      {helpSections.map(({ title, items }, index) => (
        <section key={index}>
          <h3 className={styles.help__title}>{title}</h3>
          <ul>
            {items.map(({ strong, content, link, external }, idx) => (
              <li key={idx} className={styles.help__item}>
                <p>
                  <strong>{strong}</strong> {renderLink(link, content, external)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default Help;
