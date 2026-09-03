import React from 'react';
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'card' | 'rectangular';
    width?: string | number;
    height?: string | number;
}
export declare const Skeleton: React.FC<SkeletonProps>;
