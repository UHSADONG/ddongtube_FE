import React, { Component } from 'react';

import { Navigate } from 'react-router';
import { ApiError } from '@/error/apiError';

interface ErrorBoundaryProps {

}

interface ErrorBoundaryState {
    hasError: boolean;
    isApiError: boolean;
}

export default class ErrorBoundary extends Component<
    React.PropsWithChildren<ErrorBoundaryProps>,
    ErrorBoundaryState
> {
    constructor(props: React.PropsWithChildren<ErrorBoundaryProps>) {
        super(props);
        this.state = {
            isApiError: false,
            hasError: false,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        console.error('ErrorBoundary caught an error:', error);
        if (error instanceof ApiError) {
            return {
                hasError: true,
                isApiError: true
            };
        }
        return {
            hasError: true,
            isApiError: false
        };
    }

    render() {
        if (this.state.hasError) {
            if (this.state.isApiError) {
                return <Navigate to="/error/PNF" replace />;
            }
            return <Navigate to="/error" replace />;
        }

        return this.props.children;
    }
}