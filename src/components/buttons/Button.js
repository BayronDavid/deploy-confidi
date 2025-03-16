import React, { useState } from 'react';
import './Button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../modal/Modal';

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
 *  - tooltipTitle: título opcional para el modal de tooltip
 *  - children: contenido para el tooltip modal (si existe, habilita el tooltip)
 *  - width: ancho personalizado del botón (puede ser en px, %, rem, etc.)
 *  - ...rest: otras props opcionales (target="_blank", etc.)
 */

function Button({
    label,
    iconUrl,
    url,
    onClick,
    disabled = false,
    variant = 'primary',
    tooltipTitle,
    children,
    width,
    ...rest
}) {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const hasTooltip = Boolean(children);

    // Construimos la clase base y modificadores BEM
    const classNames = [
        'button',
        `button--${variant}`,
        disabled ? 'button--disabled' : '',
        hasTooltip ? 'button--with-tooltip' : ''
    ]
        .filter(Boolean)
        .join(' ');
    
    const handleButtonClick = (e) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        
        if (onClick) {
            onClick(e);
        }
    };

    const handleTooltipClick = (e) => {
        e.stopPropagation(); // Prevent button click when clicking on tooltip icon
        e.preventDefault(); // Prevent navigation if it's a link
        setIsTooltipOpen(true);
    };

    // Estilo inline para el ancho personalizado
    const buttonStyle = width ? { width } : {};

    // Contenido del botón con tooltip interno
    const buttonContent = (
        <>
            <span className="button__content">
                {label && <span className="button__label">{label}</span>}
                {iconUrl && (
                    <img src={iconUrl} alt="" className="button__icon" />
                )}
            </span>
            {hasTooltip && (
                <span className="button__tooltip-icon" onClick={handleTooltipClick}>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
            )}
        </>
    );

    // Si tenemos `url`, renderizamos un <a>, si no, un <button>
    if (url) {
        return (
            <>
                <a
                    href={url}
                    className={classNames}
                    aria-disabled={disabled}
                    onClick={handleButtonClick}
                    style={buttonStyle}
                    {...rest}
                >
                    {buttonContent}
                </a>
                {hasTooltip && (
                    <Modal
                        isOpen={isTooltipOpen}
                        onClose={() => setIsTooltipOpen(false)}
                        title={tooltipTitle || label || "Información"}
                    >
                        <div>{children}</div>
                    </Modal>
                )}
            </>
        );
    }

    // Botón nativo
    return (
        <>
            <button
                type="button"
                className={classNames}
                onClick={handleButtonClick}
                disabled={disabled}
                style={buttonStyle}
                {...rest}
            >
                {buttonContent}
            </button>
            {hasTooltip && (
                <Modal
                    isOpen={isTooltipOpen}
                    onClose={() => setIsTooltipOpen(false)}
                    title={tooltipTitle || label || "Información"}
                >
                    <div>{children}</div>
                </Modal>
            )}
        </>
    );
}

export default Button;
