import React from 'react';
import { Helmet } from 'react-helmet-async';

export function PageMeta({
  title,
  children,
}:
  | {
      title: string;
      children?: never;
    }
  | {
      title?: never;
      children: React.ReactNode;
    }) {
  return (
    <Helmet titleTemplate={`%s - Kiraya`}>
      {title ? <title>{title}</title> : null}
      {children}
    </Helmet>
  );
}
