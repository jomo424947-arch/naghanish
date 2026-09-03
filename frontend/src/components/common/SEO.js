import { useEffect } from 'react';
import { useThemeStore } from '@store/themeStore';
export const SEO = ({ title = 'نغنِش - منصة الألعاب التفاعلية والاختبارات الذكية', description = 'نغنِش هي منصتك الترفيهية الفائقة للألعاب الذهنية، اختبارات الشخصية، والبارتي نايت التفاعلي الجماعي مع أصدقائك.', keywords = ['نغنش', 'ألعاب ذهنية', 'اختبارات شخصية', 'بارتي نايت', 'العاب اطفال', 'العاب سرعة', 'العاب ذاكرة', 'Naghanish', 'Brain Games', 'Quizzes'], image = '/og-image.png', url = typeof window !== 'undefined' ? window.location.href : 'https://naghanish.app', type = 'website', jsonLd, }) => {
    const { dir, language } = useThemeStore();
    useEffect(() => {
        // Set document title
        const fullTitle = title.includes('نغنِش') ? title : `${title} | نغنِش`;
        document.title = fullTitle;
        // Update HTML attributes
        document.documentElement.lang = language || 'ar';
        document.documentElement.dir = dir || 'rtl';
        // Helper to update meta tag
        const updateMeta = (name, content, attr = 'name') => {
            let element = document.querySelector(`meta[${attr}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };
        // Update Meta tags
        updateMeta('description', description);
        updateMeta('keywords', keywords.join(', '));
        updateMeta('author', 'Naghanish Team');
        // OpenGraph
        updateMeta('og:title', fullTitle, 'property');
        updateMeta('og:description', description, 'property');
        updateMeta('og:image', image, 'property');
        updateMeta('og:url', url, 'property');
        updateMeta('og:type', type, 'property');
        updateMeta('og:locale', language === 'ar' ? 'ar_AR' : 'en_US', 'property');
        // Twitter Card
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', description);
        updateMeta('twitter:image', image);
        // Canonical link
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', url);
        // JSON-LD structured data
        let scriptJsonLd = document.querySelector('script[type="application/ld+json"]');
        if (jsonLd) {
            if (!scriptJsonLd) {
                scriptJsonLd = document.createElement('script');
                scriptJsonLd.setAttribute('type', 'application/ld+json');
                document.head.appendChild(scriptJsonLd);
            }
            scriptJsonLd.textContent = JSON.stringify(jsonLd);
        }
        else if (scriptJsonLd) {
            scriptJsonLd.textContent = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Naghanish',
                alternateName: 'نغنِش',
                url: 'https://naghanish.app',
                description: description,
            });
        }
    }, [title, description, keywords, image, url, type, jsonLd, dir, language]);
    return null;
};
