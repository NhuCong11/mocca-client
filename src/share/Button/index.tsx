import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';
import { fonts } from '@/styles/fonts';
import { Link } from '@/i18n/routing';
import { ButtonProps } from './constant';

const Button: React.FC<ButtonProps> = ({ to, href, className, children, leftIcon, rightIcon, ...props }) => {
  let Comp: React.ElementType = 'button';

  // Boolean props
  const booleanProps = [
    'primary',
    'outline',
    'large',
    'action',
    'checkout',
    'haveProducts',
    'disabled',
    'auth',
    'authGoogle',
    'more',
    'order',
    'send',
    'cancel',
    'mobile',
    'tabletLaptop',
    'shopAction',
    'nextPage',
    'pageNumber',
    'profileNavTitle',
    'profileNavItem',
    'changeProfile',
  ];

  const otherProps = { ...props };
  const classProps: Record<string, boolean> = {};

  booleanProps.forEach((key) => {
    if (props[key]) {
      classProps[key] = true;
      delete otherProps[key];
    }
  });

  if (props.disabled) {
    Object.keys(otherProps).forEach((key) => {
      if (key.startsWith('on') && typeof otherProps[key] === 'function') {
        delete otherProps[key];
      }
    });
  }

  if (to) {
    otherProps.href = to;
    Comp = Link;
  } else if (href) {
    otherProps.href = href;
    Comp = 'a';
  }

  const dynamicClasses = Object.keys(classProps).reduce((acc, key) => {
    acc[styles[key]] = classProps[key];
    return acc;
  }, {} as Record<string, boolean>);

  const classes = clsx(styles.wrapper, fonts.inter, className, dynamicClasses);

  return (
    <Comp className={classes} {...otherProps}>
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      <p className={styles.title}>{children}</p>
      {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </Comp>
  );
};

export default Button;
