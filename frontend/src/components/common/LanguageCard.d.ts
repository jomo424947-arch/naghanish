import React from 'react';
export interface LanguageCardProps {
    id: 'ar' | 'en';
    name: string;
    nativeName: string;
    flag: string;
    dirText: string;
    selected?: boolean;
    onClick?: () => void;
}
export declare const LanguageCard: React.FC<LanguageCardProps>;
