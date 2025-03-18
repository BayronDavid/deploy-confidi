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

    return (
        <div className="accordion">
            <button className="accordion__header" onClick={toggleAccordion}>
                <span>{title}</span>
                <Button
                    onClick={() => null}
                    variant="secondary"
                    iconUrl={
                        isOpen
                            ? "/ui/chevron-up.svg"
                            : "/ui/chevron-down.svg"
                    }
                />
                {/* {isOpen ? (
                    <FontAwesomeIcon icon={faChevronDown} />
                ) : (
                    <FontAwesomeIcon icon={faChevronUp} />
                )
                } */}

            </button>
            {isOpen && <div className="accordion__content">{children}</div>}
        </div>
    );
}
