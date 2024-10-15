import React from 'react';
import { Fade } from 'react-awesome-reveal';

type MainTitleProps = {
  children?: React.ReactNode;
};

export function MainTitle({ children }: MainTitleProps): JSX.Element {
  return (
    <Fade cascade damping={0.1}>
      <h1 className="h1-guru pb-6 pt-6 text-center uppercase">{children}</h1>
    </Fade>
  );
}
