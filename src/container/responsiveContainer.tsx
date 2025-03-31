import React from 'react';

type ResponsiveContainerProps = {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const ResponsiveContainer = ({
    children,
    ...restProps
}: ResponsiveContainerProps) => {
    return (
        <div className="h-dvh min-w-screen bg-background overflow-hidden"
            {...restProps}
        >
            <div
                className="flex flex-col max-w-2xl h-dvh mx-auto items-center justify-start bg-background px-6"
            >
                {children}
            </div>
        </div>
    );
};