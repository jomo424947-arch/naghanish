import React from 'react';
export interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
    showTagline?: boolean;
    className?: string;
    animated?: boolean;
}
export declare const Logo: React.FC<LogoProps>;
