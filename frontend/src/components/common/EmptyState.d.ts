import React from 'react';
export interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}
export declare const EmptyState: React.FC<EmptyStateProps>;
