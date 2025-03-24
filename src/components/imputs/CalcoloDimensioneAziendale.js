"use client";
import React, { useState } from "react";
import "./DynamicInputGrid.css"; // Reutiliza tus clases CSS de DynamicInputGrid
import "./CalcoloDimensioneAziendale.css"; // Importamos los estilos específicos
import HtmlRenderer from "@/utils/HtmlRenderer"; // Ajusta la ruta según tu proyecto
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

/**
 * Este componente muestra:
 * 1) "Impresa Richiedente" con dos filas (Año 1 y Año 2), pero solo un input
 *    en la columna "Denominazione e C.F. Impresa" (fila 1).
 * 2) Varias "Empresas adicionales" (opcionales), con la misma estructura
 *    de columnas y filas, más un botón "Elimina impresa".
 * 3) Un botón para "Aggiungi Impresa Collegata o associata".
 *
 * El layout usa las clases de `DynamicInputGrid` para una grilla horizontal
 * con scroll en caso de desbordamiento.
 */
export default function CalcoloDimensioneAziendale({
    // Datos iniciales para la empresa principal
    initialRichiedente = {
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
    // Lista inicial de empresas opcionales
    initialImprese = [],

    // Etiquetas personalizables
    mainLabel = "Impresa Richiedente",
    addButtonLabel = "Aggiungi Impresa Collegata o associata",

    // Callback para notificar cambios (puede ser opcional)
    onChange
}) {
    // ----- ESTADO -----
    const [richiedente, setRichiedente] = useState(initialRichiedente);

    // Cada empresa opcional tiene la misma estructura que la principal
    // más un `id` único para poder identificarla y eliminarla
    const [imprese, setImprese] = useState(
        initialImprese.map((item, idx) => ({
            id: `opt-${Date.now()}-${idx}`,
            ...item
        }))
    );

    // ----- HANDLERS -----
    const handleChangeRichiedente = (field, value) => {
        const updated = { ...richiedente, [field]: value };
        setRichiedente(updated);
        notifyChange(updated, imprese);
    };

    const handleAddImpresa = () => {
        const newImpresa = {
            id: `opt-${Date.now()}`,
            denominazioneCf: "",
            anno1: "",
            anno2: "",
            fatturatoAnno1: "",
            fatturatoAnno2: "",
            attivoAnno1: "",
            attivoAnno2: "",
            occupatiAnno1: "",
            occupatiAnno2: ""
        };
        const updated = [...imprese, newImpresa];
        setImprese(updated);
        notifyChange(richiedente, updated);
    };

    const handleRemoveImpresa = (id) => {
        const updated = imprese.filter((imp) => imp.id !== id);
        setImprese(updated);
        notifyChange(richiedente, updated);
    };

    const handleChangeImpresa = (id, field, value) => {
        const updated = imprese.map((imp) =>
            imp.id === id ? { ...imp, [field]: value } : imp
        );
        setImprese(updated);
        notifyChange(richiedente, updated);
    };

    // Notifica al padre (si se desea) el estado actual
    const notifyChange = (mainData, impreseData) => {
        if (onChange) {
            onChange({
                richiedente: mainData,
                imprese: impreseData
            });
        }
    };

    // Calcula los totales de todas las empresas (richiedente + opcionales)
    const calculateTotals = () => {
        // Inicializar totales en 0
        let totals = {
            fatturatoAnno1: 0,
            fatturatoAnno2: 0,
            attivoAnno1: 0,
            attivoAnno2: 0
        };
        
        // Sumar los valores de la empresa principal (richiedente)
        // Convertimos a número y sumamos solo si hay un valor válido
        if (richiedente.fatturatoAnno1) totals.fatturatoAnno1 += Number(richiedente.fatturatoAnno1);
        if (richiedente.fatturatoAnno2) totals.fatturatoAnno2 += Number(richiedente.fatturatoAnno2);
        if (richiedente.attivoAnno1) totals.attivoAnno1 += Number(richiedente.attivoAnno1);
        if (richiedente.attivoAnno2) totals.attivoAnno2 += Number(richiedente.attivoAnno2);
        
        // Sumar los valores de todas las empresas opcionales
        imprese.forEach(imp => {
            if (imp.fatturatoAnno1) totals.fatturatoAnno1 += Number(imp.fatturatoAnno1);
            if (imp.fatturatoAnno2) totals.fatturatoAnno2 += Number(imp.fatturatoAnno2);
            if (imp.attivoAnno1) totals.attivoAnno1 += Number(imp.attivoAnno1);
            if (imp.attivoAnno2) totals.attivoAnno2 += Number(imp.attivoAnno2);
        });
        
        return totals;
    };

    // Renderizar sección de totales
    const renderTotals = () => {
        const totals = calculateTotals();
        
        return (
            <div className="cda-totali">
                <h3 className="cda-title">Totali</h3>
                <div className="option-grid">
                    {/* Títulos de columna para totales */}
                    <div className="option-grid__column-titles">
                        <div className="option-grid__column-title anno">
                            Anno di Riferimento
                        </div>
                        <div className="option-grid__column-title valore">
                            Fatturato
                        </div>
                        <div className="option-grid__column-title valore">
                            Attivo
                        </div>
                    </div>
                    
                    <div className="option-grid__list">
                        {/* Fila Año 1 */}
                        <div className="option-grid__row">
                            <div className="option-grid__column anno">
                                <div className="option-grid__input-pill">
                                    <span>Anno {richiedente.anno1 || "1"}</span>
                                </div>
                            </div>
                            <div className="option-grid__column valore">
                                <div className="option-grid__input-pill">
                                    <span>{totals.fatturatoAnno1.toLocaleString()} €</span>
                                </div>
                            </div>
                            <div className="option-grid__column valore">
                                <div className="option-grid__input-pill">
                                    <span>{totals.attivoAnno1.toLocaleString()} €</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Fila Año 2 */}
                        <div className="option-grid__row">
                            <div className="option-grid__column anno">
                                <div className="option-grid__input-pill">
                                    <span>Anno {richiedente.anno2 || "2"}</span>
                                </div>
                            </div>
                            <div className="option-grid__column valore">
                                <div className="option-grid__input-pill">
                                    <span>{totals.fatturatoAnno2.toLocaleString()} €</span>
                                </div>
                            </div>
                            <div className="option-grid__column valore">
                                <div className="option-grid__input-pill">
                                    <span>{totals.attivoAnno2.toLocaleString()} €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ----- SUBCOMPONENTES DE RENDER -----
    /**
     * Renderiza los títulos de columna (una sola fila).
     */
    const renderColumnTitles = () => {
        return (
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
                {/* Columna para botón "Elimina impresa" (solo en empresas opcionales) */}
            </div>
        );
    };

    /**
     * Renderiza las 2 filas (Año 1 y Año 2) para la empresa "principal" (richiedente).
     * Solo la primera fila muestra el input de Denominazione e C.F.
     */
    const renderImpresaRichiedente = () => {
        return (
            <div className="option-grid__list">
                {/* Fila Año 1 */}
                <div className="option-grid__row">
                    {/* Denominazione (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 20%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="text"
                                placeholder="Impresa Richiedente"
                                value={richiedente.denominazioneCf}
                                onChange={(e) =>
                                    handleChangeRichiedente("denominazioneCf", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Anno di Riferimento (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="Anno 1"
                                value={richiedente.anno1}
                                onChange={(e) => handleChangeRichiedente("anno1", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fatturato (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="In migliaia di euro"
                                value={richiedente.fatturatoAnno1}
                                onChange={(e) =>
                                    handleChangeRichiedente("fatturatoAnno1", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Attivo (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="In migliaia di euro"
                                value={richiedente.attivoAnno1}
                                onChange={(e) =>
                                    handleChangeRichiedente("attivoAnno1", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Occupati ULA (fila 1) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="Ingresso numerico"
                                value={richiedente.occupatiAnno1}
                                onChange={(e) =>
                                    handleChangeRichiedente("occupatiAnno1", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Fila Año 2 */}
                <div className="option-grid__row">
                    {/* Denominazione (fila 2) => vacío */}
                    <div className="option-grid__column" style={{ flex: "0 0 20%" }} />

                    {/* Anno di Riferimento (fila 2) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="Anno 2"
                                value={richiedente.anno2}
                                onChange={(e) => handleChangeRichiedente("anno2", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fatturato (fila 2) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="In migliaia di euro"
                                value={richiedente.fatturatoAnno2}
                                onChange={(e) =>
                                    handleChangeRichiedente("fatturatoAnno2", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Attivo (fila 2) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="In migliaia di euro"
                                value={richiedente.attivoAnno2}
                                onChange={(e) =>
                                    handleChangeRichiedente("attivoAnno2", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Occupati ULA (fila 2) */}
                    <div className="option-grid__column" style={{ flex: "0 0 15%" }}>
                        <div className="option-grid__input-pill">
                            <input
                                type="number"
                                placeholder="Ingresso numerico"
                                value={richiedente.occupatiAnno2}
                                onChange={(e) =>
                                    handleChangeRichiedente("occupatiAnno2", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Renderiza cada empresa opcional con la misma estructura
     * (2 filas, 5 columnas), más un botón "Elimina impresa".
     */
    const renderImpresaOpzionale = (imp, index) => {
        // index para mostrar "Impresa 2", "Impresa 3", etc.
        const numero = index + 2;

        // Handler local para simplificar
        const handleFieldChange = (field, value) => {
            handleChangeImpresa(imp.id, field, value);
        };

        return (
            <div key={imp.id} style={{ marginBottom: "1rem" }}>
                {/* Encabezado o título para la empresa opcional */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem"
                    }}
                >
                    <strong>Impresa {numero}</strong>
                    <button
                        type="button"
                        className="option-grid__remove-btn"
                        onClick={() => handleRemoveImpresa(imp.id)}
                    >
                        Elimina impresa <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>

                {/* Repetimos la misma grilla de columnas y filas */}
                <div className="option-grid" style={{ overflowX: "auto" }}>
                    {/* Títulos de columna */}
                    {renderColumnTitles()}

                    <div className="option-grid__list">
                        {/* Fila Año 1 */}
                        <div className="option-grid__row">
                            {/* Denominazione (fila 1) */}
                            <div className="option-grid__column" style={{ flex: "0 0 20%" }}>
                                <div className="option-grid__input-pill">
                                    <input
                                        type="text"
                                        placeholder="Denominazione e C.F."
                                        value={imp.denominazioneCf}
                                        onChange={(e) =>
                                            handleFieldChange("denominazioneCf", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Anno di Riferimento (fila 1) */}
                            <div
                                className="option-grid__column"
                                style={{ flex: "0 0 15%" }}
                            >
                                <div className="option-grid__input-pill">
                                    <input
                                        type="number"
                                        placeholder="Anno 1"
                                        value={imp.anno1}
                                        onChange={(e) =>
                                            handleFieldChange("anno1", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Fatturato (fila 1) */}
                            <div
                                className="option-grid__column"
                                style={{ flex: "0 0 15%" }}
                            >
                                <div className="option-grid__input-pill">
                                    <input
                                        type="number"
                                        placeholder="In migliaia di euro"
                                        value={imp.fatturatoAnno1}
                                        onChange={(e) =>
                                            handleFieldChange("fatturatoAnno1", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Attivo (fila 1) */}
                            <div
                                className="option-grid__column"
                                style={{ flex: "0 0 15%" }}
                            >
                                <div className="option-grid__input-pill">
                                    <input
                                        type="number"
                                        placeholder="In migliaia di euro"
                                        value={imp.attivoAnno1}
                                        onChange={(e) =>
                                            handleFieldChange("attivoAnno1", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Occupati ULA (fila 1) */}
                            <div
                                className="option-grid__column"
                                style={{ flex: "0 0 15%" }}
                            >
                                <div className="option-grid__input-pill">
                                    <input
                                        type="number"
                                        placeholder="Ingresso numerico"
                                        value={imp.occupatiAnno1}
                                        onChange={(e) =>
                                            handleFieldChange("occupatiAnno1", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fila Año 2 */}
                        <div className="option-grid__row">
                            {/* Denominazione (fila 2) => vacío */}
                            <div
                                className="option-grid__column"
                                style={{ flex: "0 0 20%" }}
                            />

                            {/* Anno di Riferimento (fila 2) */}
                            <div
                                className="option-grid__column"
                                style={{ flex: "0 0 15%" }}
                            >
                                <div className="option-grid__input-pill">
                                    <input
                                        type="number"
                                        placeholder="Anno 2"
                                        value={imp.anno2}
                                        onChange={(e) =>
                                            handleFieldChange("anno2", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Fatturato (fila 2) */}
                            <div
                                className="option-grid__column"
                                style={{ flex: "0 0 15%" }}
                            >
                                <div className="option-grid__input-pill">
                                    <input
                                        type="number"
                                        placeholder="In migliaia di euro"
                                        value={imp.fatturatoAnno2}
                                        onChange={(e) =>
                                            handleFieldChange("fatturatoAnno2", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Attivo (fila 2) */}
                            <div
                                className="option-grid__column"
                                style={{ flex: "0 0 15%" }}
                            >
                                <div className="option-grid__input-pill">
                                    <input
                                        type="number"
                                        placeholder="In migliaia di euro"
                                        value={imp.attivoAnno2}
                                        onChange={(e) =>
                                            handleFieldChange("attivoAnno2", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Occupati ULA (fila 2) */}
                            <div
                                className="option-grid__column"
                                style={{ flex: "0 0 15%" }}
                            >
                                <div className="option-grid__input-pill">
                                    <input
                                        type="number"
                                        placeholder="Ingresso numerico"
                                        value={imp.occupatiAnno2}
                                        onChange={(e) =>
                                            handleFieldChange("occupatiAnno2", e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ----- RENDER PRINCIPAL -----
    return (
        <div className="calcolo-dimensione-aziendale">
            {/* Título global */}
            <div className="cda-title">
                {HtmlRenderer("Calcolo dimensione Aziendale")}
            </div>

            {/* Bloque para Impresa Richiedente */}
            <div className="option-grid" style={{ overflowX: "auto" }}>
                {/* Etiqueta (e.g. "Impresa Richiedente") */}
                <div className="option-grid__label">
                    {HtmlRenderer(mainLabel)}
                </div>
                {renderColumnTitles()}
                {renderImpresaRichiedente()}
            </div>

            {/* Lista de empresas opcionales */}
            {imprese.map((imp, idx) => renderImpresaOpzionale(imp, idx))}

            {/* Botón para añadir empresa */}
            <div className="option-grid__add-row">
                <button
                    type="button"
                    className="add-row-button"
                    onClick={handleAddImpresa}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>{addButtonLabel}</span>
                </button>
            </div>

            {/* Sección de totales */}
            {renderTotals()}
        </div>
    );
}
