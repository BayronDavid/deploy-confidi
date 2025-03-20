import React, { useState } from 'react';
import './Button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../modal/Modal';

function Button({
    label,
    iconUrl,
    url,
    onClick,
    disabled = false,
    variant = 'primary', // "primary", "secondary", "light", "dark"
    size,               // "big", "small", "mobile"
    pulse = false,
    fancy = false,
    subtle = false,     // <--- Add subtle hover effect prop
    tooltipTitle,
    children,
    width,
    active = false,
    ...rest
}) {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const hasTooltip = Boolean(children);
    const isIconOnly = iconUrl && !label;

    // Construye las clases BEM según las props
    const classNames = [
        'button',
        "no-select",
        `button--${variant}`,
        size && `button--${size}`,
        pulse && 'button--pulse',
        fancy && 'button--fancy', // <--- Add fancy class if prop is true
        subtle && 'button--subtle', // <--- Add subtle class if prop is true
        disabled && 'button--disabled',
        hasTooltip && 'button--with-tooltip',
        isIconOnly && 'button--icon-only',
        active && 'button--active' // <--- Aplica clase "active" si corresponde
    ]
        .filter(Boolean)
        .join(' ');

    const handleButtonClick = (e) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        onClick && onClick(e);
    };

    const handleTooltipClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsTooltipOpen(true);
    };

    const buttonStyle = width ? { width } : {};

    const buttonContent = (
        <>
            <span className="button__content">
                {label && <span className="button__label">{label}</span>}
                {iconUrl && <img src={iconUrl} alt="" className="button__icon" />}
            </span>
            {hasTooltip && (
                <span className="button__tooltip-icon" onClick={handleTooltipClick}>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
            )}
        </>
    );

    // Renderiza un <a> si hay `url`, o <button> en caso contrario
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
                        title={tooltipTitle || label || 'Información'}
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
                    title={tooltipTitle || label || 'Información'}
                >
                    <div>{children}</div>
                </Modal>
            )}
        </>
    );
}

export default Button;
