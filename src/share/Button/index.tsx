import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';
import { fonts } from '@/styles/fonts';
import { ButtonProps } from '@/types';
import { Link } from '@/i18n/routing';

const Button: React.FC<ButtonProps> = ({ to, href, className, children, leftIcon, rightIcon, onClick, ...props }) => {
  let Comp: React.ElementType = 'button';

  const otherProps: Record<string, unknown> = { onClick, ...props };

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

  const classProps: Record<string, boolean | undefined> = {
    primary: props.primary,
    outline: props.outline,
    large: props.large,
    action: props.action,
    checkout: props.checkout,
    haveProducts: props.haveProducts,
    disabled: props.disabled,
    auth: props.auth,
    authGoogle: props.authGoogle,
    more: props.more,
    order: props.order,
    send: props.send,
    cancel: props.cancel,
    mobile: props.mobile,
    tabletLaptop: props.tabletLaptop,
    shopAction: props.shopAction,
    nextPage: props.nextPage,
    pageNumber: props.pageNumber,
    profileNavTitle: props.profileNavTitle,
    profileNavItem: props.profileNavItem,
    changeProfile: props.changeProfile,
  };

  const dynamicClasses = Object.keys(classProps).reduce((acc, key) => {
    if (classProps[key]) {
      acc[styles[key]] = true;
    }
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
