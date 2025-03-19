"use client";
import React, { useState } from "react";
import "./Accordion.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Button from "./buttons/Button";

/**
 * Componente genérico de Acordeón.
 * @param {string|JSX.Element} title - Título mostrado en la cabecera.
 * @param {React.ReactNode} children - Contenido del acordeón.
 * @param {boolean} defaultOpen - Indica si inicia abierto.
 */
export default function Accordion({ title, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAccordion();
        }
    };

    return (
        <div className="accordion">
            <div 
                className="accordion__header" 
                onClick={toggleAccordion}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={handleKeyDown}
            >
                <span>{title}</span>
                <Button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent's onClick
                        toggleAccordion();
                    }}
                    variant="secondary"
                    iconUrl={
                        isOpen
                            ? "/ui/chevron-up.svg"
                            : "/ui/chevron-down.svg"
                    }
                />
            </div>
            {isOpen && <div className="accordion__content">{children}</div>}
        </div>
    );
}
