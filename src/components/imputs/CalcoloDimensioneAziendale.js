"use client";
import React, { useState } from "react";
import "./DynamicInputGrid.css"; // Reutiliza las mismas clases CSS de tu proyecto
import HtmlRenderer from "@/utils/HtmlRenderer"; // Ajusta la ruta según tu proyecto

/**
 * Componente que muestra "Impresa Richiedente" con 5 columnas:
 * 1) Denominazione e C.F. Impresa
 * 2) Anno di Riferimento
 * 3) Fatturato
 * 4) Attivo
 * 5) Occupati ULA
 *
 * Cada columna se repite en dos filas (Año 1 y Año 2),
 * excepto la primera columna (Denominazione e C.F.), que solo
 * tiene un input en la primera fila y deja la segunda fila vacía.
 */
export default function CalcoloDimensioneAziendale({
    // Valores iniciales opcionales
    initialData = {
        denominazioneCf: "",
        anno1: "",
        anno2: "",
        fatturatoAnno1: "",
        fatturatoAnno2: "",
        attivoAnno1: "",
        attivoAnno2: "",
        occupatiAnno1: "",
        occupatiAnno2: ""
    },
    label = "Impresa Richiedente",
    onChange // Callback para notificar cambios
}) {
    // Estado local para los campos
    const [data, setData] = useState(initialData);

    // Manejador de cambios
    const handleChange = (field, value) => {
        const updated = { ...data, [field]: value };
        setData(updated);
        if (onChange) onChange(updated);
    };

    return (
        <div className="option-grid" style={{ overflowX: "auto" }}>
            {/* Encabezado opcional */}
            {label && (
                <div className="option-grid__label">
                    {HtmlRenderer(label)}
                </div>
            )}

            {/* Títulos de columna (una sola fila) */}
            <div className="option-grid__column-titles">
                <div className="option-grid__column-title" style={{ flex: "0 0 20%" }}>
                    Denominazione e C.F. Impresa
                </div>
                <div className="option-grid__column-title" style={{ flex: "0 0 15%" }}>
                    Anno di Riferimento
                </div>
                <div className="option-grid__column-title" style={{ flex: "0 0 15%" }}>
                    Fatturato
                </div>
                <div className="option-grid__column-title" style={{ flex: "0 0 15%" }}>
                    Attivo
                </div>
                <div className="option-grid__column-title" style={{ flex: "0 0 15%" }}>
                    Occupati ULA
                </div>
            </div>

            {/* Contenedor de filas */}
            <div className="option-grid__list">
                {/* ========== FILA AÑO 1 ========== */}
                <div className="option-grid__row">
                    {/* Denominazione e C.F. Impresa (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 20%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="text"
                                placeholder="Impresa Richiedente"
                                value={data.denominazioneCf}
                                onChange={(e) => handleChange("denominazioneCf", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Anno di Riferimento (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="Anno 1"
                                value={data.anno1}
                                onChange={(e) => handleChange("anno1", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fatturato (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="In migliaia di euro"
                                value={data.fatturatoAnno1}
                                onChange={(e) => handleChange("fatturatoAnno1", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Attivo (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="In migliaia di euro"
                                value={data.attivoAnno1}
                                onChange={(e) => handleChange("attivoAnno1", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Occupati ULA (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="Ingresso numerico"
                                value={data.occupatiAnno1}
                                onChange={(e) => handleChange("occupatiAnno1", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* ========== FILA AÑO 2 ========== */}
                <div className="option-grid__row">
                    {/* Denominazione e C.F. Impresa (fila 2) => vacío */}
                    <div className="option-grid__column" style={{ flex: "0 0 20%" }}>
                        {/* No input aquí, queda en blanco */}
                    </div>

                    {/* Anno di Riferimento (fila 2) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="Anno 2"
                                value={data.anno2}
                                onChange={(e) => handleChange("anno2", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fatturato (fila 2) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="In migliaia di euro"
                                value={data.fatturatoAnno2}
                                onChange={(e) => handleChange("fatturatoAnno2", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Attivo (fila 2) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="In migliaia di euro"
                                value={data.attivoAnno2}
                                onChange={(e) => handleChange("attivoAnno2", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Occupati ULA (fila 2) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="Ingresso numerico"
                                value={data.occupatiAnno2}
                                onChange={(e) => handleChange("occupatiAnno2", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
