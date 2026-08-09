import React from 'react';
export type SocialProvider = 'google' | 'apple';
export interface SocialLoginButtonProps {
    provider: SocialProvider;
    onClick?: () => void;
    label?: string;
    isLoading?: boolean;
    className?: string;
}
export declare const SocialLoginButton: React.FC<SocialLoginButtonProps>;
