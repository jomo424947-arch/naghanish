import React from 'react';
export interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    variant?: 'dots' | 'bar';
    showLabels?: boolean;
    className?: string;
}
export declare const ProgressIndicator: React.FC<ProgressIndicatorProps>;
