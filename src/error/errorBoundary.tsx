import * as Sentry from "@sentry/react";
import React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        Sentry.captureReactException(error, info);
    }

    render() {
        return this.props.children;
    }
}
