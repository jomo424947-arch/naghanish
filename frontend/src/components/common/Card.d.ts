import React from 'react';
import { HTMLMotionProps } from 'framer-motion';
export type CardVariant = 'default' | 'glowing' | 'glass' | 'gradient' | 'bordered';
export type CardGlowColor = 'purple' | 'blue' | 'orange' | 'cyan' | 'green';
export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children?: React.ReactNode;
    variant?: CardVariant;
    glowColor?: CardGlowColor;
    isInteractive?: boolean;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}
export declare const Card: React.FC<CardProps>;
