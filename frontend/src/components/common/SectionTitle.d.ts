import React from 'react';
export interface SectionTitleProps {
    title: string;
    subtitle?: string;
    badgeText?: string;
    badgeColor?: 'purple' | 'blue' | 'orange' | 'green' | 'pink';
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}
export declare const SectionTitle: React.FC<SectionTitleProps>;
