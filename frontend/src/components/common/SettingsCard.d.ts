import React from 'react';
export interface SettingsCardProps {
    icon: React.ReactNode;
    iconBgColor?: string;
    title: string;
    description?: string;
    action?: React.ReactNode;
    badge?: string;
    onClick?: () => void;
    isDanger?: boolean;
}
export declare const SettingsCard: React.FC<SettingsCardProps>;
