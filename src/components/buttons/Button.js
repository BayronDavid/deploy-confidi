import React, { useState } from 'react';
import './Button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from '../modal/Modal';

/**
 * Componente de botón altamente personalizable que usa las variables CSS globales.
 *
 * @component
 * 
 * @param {Object} props - Las props del componente
 * @param {string} [props.label] - Texto que se mostrará dentro del botón
 * @param {string} [props.iconUrl] - Ruta de la imagen/ícono opcional
 * @param {string} [props.url] - Si existe, el botón se renderiza como un enlace <a>
 * @param {Function} [props.onClick] - Callback al hacer clic (solo aplica cuando NO hay url)
 * @param {boolean} [props.disabled=false] - Si está deshabilitado
 * @param {string} [props.variant='primary'] - Tipo de botón
 *   - 'primary': Botón rosa con hover estándar
 *   - 'secondary': Botón negro con hover estándar
 *   - 'secondary-fancy': Botón negro que al hover cambia a rosa de izquierda a derecha
 *   - 'gray': Botón gris que cambia a rosa en hover
 *   - 'outline': Botón con borde rosa y fondo transparente
 *   - 'blue': Botón azul de marca
 *   - 'yellow': Botón amarillo de marca
 *   - 'green': Botón verde de marca
 * @param {string} [props.size] - Tamaño del botón: 'small', 'medium' (default), 'large'
 * @param {boolean} [props.pulse=false] - Añade efecto de pulso al botón
 * @param {string} [props.tooltipTitle] - Título opcional para el modal de tooltip
 * @param {React.ReactNode} [props.children] - Contenido para el tooltip modal (si existe, habilita el tooltip)
 * @param {string|number} [props.width] - Ancho personalizado del botón (puede ser en px, %, rem, etc.)
 * @param {Object} [props.rest] - Otras props opcionales (target="_blank", etc.)
 *
 * @example
 * // Botón primario básico
 * <Button label="Guardar cambios" />
 *
 * @example
 * // Botón negro que cambia a rosa en hover (de izquierda a derecha)
 * <Button 
 *   label="Efecto especial" 
 *   variant="secondary-fancy" 
 *   onClick={() => console.log('Clicked!')} 
 * />
 *
 * @example
 * // Botón gris que cambia a rosa en hover
 * <Button 
 *   label="Más información" 
 *   variant="gray" 
 *   url="/info" 
 * />
 *
 * @example
 * // Botón con tooltip
 * <Button 
 *   label="Ayuda" 
 *   variant="outline"
 *   tooltipTitle="Instrucciones"
 * >
 *   <p>Este botón proporciona ayuda sobre la funcionalidad.</p>
 * </Button>
 */
function Button({
    label,
    iconUrl,
    url,
    onClick,
    disabled = false,
    variant = 'primary',
    size,
    pulse = false,
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
        size && `button--${size}`,
        pulse && 'button--pulse',
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

    const buttonStyle = width ? { width } : {};

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
