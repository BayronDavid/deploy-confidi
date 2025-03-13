import React from 'react';
import './Button.css';

/**
 * Componente de botón que puede actuar como:
 *  - <button> nativo (si NO se pasa prop `url`)
 *  - <a> enlace (si se pasa prop `url`)
 *
 * Props:
 *  - label: texto que se mostrará dentro del botón
 *  - iconUrl: ruta de la imagen/ícono opcional
 *  - url: si existe, el botón se renderiza como un enlace <a>
 *  - onClick: callback al hacer clic (solo aplica cuando NO hay url)
 *  - disabled: si está deshabilitado
 *  - variant: tipo de botón (p. ej. 'primary', 'secondary', etc.)
 *  - ...rest: otras props opcionales (target="_blank", etc.)
 */

function Button({
    label,
    iconUrl,
    url,
    onClick,
    disabled = false,
    variant = 'primary',
    ...rest
}) {
    // Construimos la clase base y modificadores BEM
    const classNames = [
        'button',
        `button--${variant}`,
        disabled ? 'button--disabled' : '',
    ]
        .filter(Boolean)
        .join(' ');

    // Si tenemos `url`, renderizamos un <a>, si no, un <button>
    if (url) {
        return (
            <a
                href={url}
                className={classNames}
                aria-disabled={disabled}
                onClick={(e) => disabled && e.preventDefault()}
                {...rest}
            >
                {label && <span className="button__label">{label}</span>}
                {iconUrl && (
                    <img src={iconUrl} alt="" className="button__icon" />
                )}
            </a>
        );
    }

    // Botón nativo
    return (
        <button
            type="button"
            className={classNames}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            {...rest}
        >
            {label && <span className="button__label">{label}</span>}
            {iconUrl && (
                <img src={iconUrl} alt="" className="button__icon" />
            )}
        </button>
    );
}

export default Button;
