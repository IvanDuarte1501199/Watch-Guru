import React from 'react';

type MainTitleProps = {
    children?: React.ReactNode;
};

export function MainTitle({ children }: MainTitleProps): JSX.Element {
    return (
        <h1 className="h1-guru pb-6 pt-6 text-center uppercase">{children}</h1>
    );
}
