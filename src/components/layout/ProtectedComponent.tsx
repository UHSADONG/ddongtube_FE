import { ReactNode } from "react";

type ProtectedComponentProps = {
    children: ReactNode;
}

export const ProtectedComponent = ({ children }: ProtectedComponentProps) => {
    return (
        <div>
            {children}
        </div>
    )
}