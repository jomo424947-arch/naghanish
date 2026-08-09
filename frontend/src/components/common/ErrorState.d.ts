import React from 'react';
export interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
    className?: string;
}
export declare const ErrorState: React.FC<ErrorStateProps>;
