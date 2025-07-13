import React from 'react';

// 2025-07-06 변경.
// container 컴포넌트는 퍼블리싱 역할만 하기 때문에 컴포넌트 내부로 분리

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