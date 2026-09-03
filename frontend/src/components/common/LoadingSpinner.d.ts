import React from 'react';
export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    fullScreen?: boolean;
    className?: string;
}
export declare const LoadingSpinner: React.FC<LoadingSpinnerProps>;
