import React from 'react';
import DOMPurify from 'dompurify';

const HtmlRenderer = (rawHtml) => {
    // Check if input is valid
    if (!rawHtml) return null;

    // Ensure rawHtml is a string
    const htmlContent = typeof rawHtml === 'string' ? rawHtml : String(rawHtml);

    const config = {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p',
            'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'span', 'div'
        ],
        ALLOWED_ATTR: ['href', 'title', 'target', 'class', 'style'],
        ADD_ATTR: ['target'], // Ensure target attribute works for links
        KEEP_CONTENT: true,
        RETURN_DOM_FRAGMENT: false,
        RETURN_DOM: false
    };

    // Sanitize the HTML with DOMPurify
    const sanitizedHtml = DOMPurify.sanitize(htmlContent, config);

    // Return the sanitized HTML as a dangerously set inner HTML
    // return <h1>Hello</h1>;
    return <div className="html-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default HtmlRenderer;
