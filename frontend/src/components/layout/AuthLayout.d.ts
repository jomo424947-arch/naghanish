import React from 'react';
export interface AuthLayoutProps {
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
    showBackButton?: boolean;
}
export declare const AuthLayout: React.FC<AuthLayoutProps>;
