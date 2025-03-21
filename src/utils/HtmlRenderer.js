import React from 'react';
import DOMPurify from 'dompurify';

const HtmlRenderer = (rawHtml) => {
    if (!rawHtml) return null;

    // Convertir a string en caso de que no lo sea
    const htmlContent = typeof rawHtml === 'string' ? rawHtml : String(rawHtml);

    // Verificar si contiene alguna etiqueta HTML
    const containsHtml = /<\/?[a-z][\s\S]*>/i.test(htmlContent);

    // Si es solo texto, devolverlo directamente sin envolverlo en ningún contenedor
    if (!containsHtml) {
        return htmlContent;
    }

    const config = {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p',
            'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'span', 'div'
        ],
        ALLOWED_ATTR: ['href', 'title', 'target', 'class', 'style'],
        ADD_ATTR: ['target'], // Para que funcione target en links
        KEEP_CONTENT: true,
        RETURN_DOM_FRAGMENT: false,
        RETURN_DOM: false
    };

    // Sanitizamos el HTML
    const sanitizedHtml = DOMPurify.sanitize(htmlContent, config);

    // Usamos un contenedor inline (<span>) para no romper la estructura si se renderiza dentro de un <p>
    return <span dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default HtmlRenderer;
