import React from 'react';
export type CategoryColor = 'purple' | 'cyan' | 'orange' | 'yellow' | 'green' | 'pink' | 'blue';
export interface InterestCardProps {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    color: CategoryColor;
    selected?: boolean;
    onClick?: () => void;
}
export declare const InterestCard: React.FC<InterestCardProps>;
