import React from 'react';
export interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'game';
    jsonLd?: Record<string, any>;
}
export declare const SEO: React.FC<SEOProps>;
