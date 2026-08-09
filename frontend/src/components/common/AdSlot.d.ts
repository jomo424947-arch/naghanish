import React from 'react';
export interface AdSlotProps {
    variant?: 'banner' | 'in-feed' | 'sidebar' | 'interstitial';
    slotId?: string;
    className?: string;
    sponsorName?: string;
    sponsorLogo?: string;
    adText?: string;
    adTextEn?: string;
    targetUrl?: string;
}
export declare const AdSlot: React.FC<AdSlotProps>;
