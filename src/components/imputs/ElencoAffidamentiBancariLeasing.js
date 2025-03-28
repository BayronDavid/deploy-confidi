"use client";
import React, { useState, useEffect } from "react";
import "./ElencoAffidamentiBancariLeasing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../buttons/Button";
import ToggleButtonGroup from "../buttons/ToggleButtonGroup";

/**
 * Componente único para "Affidamenti a Breve" y "Affidamenti a Scadenza".
 *
 * Props:
 *  - initialBreve: filas iniciales para "a Breve" (array)
 *  - initialScadenza: filas iniciales para "a Scadenza" (array)
 *  - mainLabel: texto para el título general
 *  - onChange: callback con la firma (data: { breve: [...], scadenza: [...] })
 *  - value: objeto con la misma estructura, si se quieren cargar datos desde fuera
 *
 * Cada fila en "breve" debe tener:
 * {
 *   id,
 *   istitutoDiCredito,
 *   formaTecnica,
 *   importoAccordato,
 *   importoUtilizzato,
 *   tipologia,
 *   garanziaAccessoria
 * }
 *
 * Cada fila en "scadenza" debe tener:
 * {
 *   id,
 *   istitutoDiCredito,
 *   formaTecnica,
 *   importoOriginario,
 *   importoResiduo,
 *   periodicitaRata,
 *   importoRata,
 *   scadenza
 * }
 */
export default function ElencoAffidamentiBancariLeasing({
    initialBreve = [],
    initialScadenza = [],
    mainLabel = "",
    onChange,
    value,
}) {
    //
    // Helpers para crear filas vacías:
    //
    const emptyBreveRow = () => ({
        id: "",
        istitutoDiCredito: "",
        formaTecnica: "",
        importoAccordato: "",
        importoUtilizzato: "",
        tipologia: "",
        garanziaAccessoria: "",
    });

    const emptyScadenzaRow = () => ({
        id: "",
        istitutoDiCredito: "",
        formaTecnica: "",
        importoOriginario: "",
        importoResiduo: "",
        periodicitaRata: "",
        importoRata: "",
        scadenza: "",
    });

    //
    // Estado para "Affidamenti a Breve":
    // Al menos 1 fila inicial (no eliminable).
    //
    const [breveEntries, setBreveEntries] = useState(() => {
        const data = initialBreve.length > 0 ? initialBreve : [emptyBreveRow()];
        return data.map((item, idx) => ({
            id: item.id || `breve-${Date.now()}-${idx}`,
            istitutoDiCredito: item.istitutoDiCredito || "",
            formaTecnica: item.formaTecnica || "",
            importoAccordato: item.importoAccordato || "",
            importoUtilizzato: item.importoUtilizzato || "",
            tipologia: item.tipologia || "",
            garanziaAccessoria: item.garanziaAccessoria || "",
        }));
    });

    //
    // Estado para "Affidamenti a Scadenza":
    // Al menos 1 fila inicial (no eliminable).
    //
    const [scadenzaEntries, setScadenzaEntries] = useState(() => {
        const data = initialScadenza.length > 0 ? initialScadenza : [emptyScadenzaRow()];
        return data.map((item, idx) => ({
            id: item.id || `scad-${Date.now()}-${idx}`,
            istitutoDiCredito: item.istitutoDiCredito || "",
            formaTecnica: item.formaTecnica || "",
            importoOriginario: item.importoOriginario || "",
            importoResiduo: item.importoResiduo || "",
            periodicitaRata: item.periodicitaRata || "",
            importoRata: item.importoRata || "",
            scadenza: item.scadenza || "",
        }));
    });

    // Estado para saber si hay crediti (true, false o null)
    const [hasCrediti, setHasCrediti] = useState(null);

    // manejar la respuesta de la pregunta "Hai crediti?"
    const handleHasCrediti = (answer) => {
        setHasCrediti(answer);
        if (answer === false) {
            const defaultBreve = {
                id: "breve-default",
                istitutoDiCredito: "Nessun credito",
                formaTecnica: "",
                importoAccordato: "0",
                importoUtilizzato: "0",
                tipologia: "",
                garanziaAccessoria: "",
            };
            const defaultScadenza = {
                id: "scad-default",
                istitutoDiCredito: "Nessun credito",
                formaTecnica: "",
                importoOriginario: "0",
                importoResiduo: "0",
                periodicitaRata: "",
                importoRata: "0",
                scadenza: "",
            };
            setBreveEntries([defaultBreve]);
            setScadenzaEntries([defaultScadenza]);
            notifyChange([defaultBreve], [defaultScadenza]);
        }
    };

    //
    // Si llega un "value" externo (por ej. desde un formulario), sincronizamos.
    //
    useEffect(() => {
        if (value && typeof value === "object") {
            const { breve, scadenza } = value;

            // Actualizar "Breve"
            if (Array.isArray(breve)) {
                const mappedBreve = breve.length > 0 ? breve : [emptyBreveRow()];
                setBreveEntries(
                    mappedBreve.map((item, idx) => ({
                        id: item.id || `breve-${Date.now()}-${idx}`,
                        istitutoDiCredito: item.istitutoDiCredito || "",
                        formaTecnica: item.formaTecnica || "",
                        importoAccordato: item.importoAccordato || "",
                        importoUtilizzato: item.importoUtilizzato || "",
                        tipologia: item.tipologia || "",
                        garanziaAccessoria: item.garanziaAccessoria || "",
                    }))
                );
            }

            // Actualizar "Scadenza"
            if (Array.isArray(scadenza)) {
                const mappedScadenza = scadenza.length > 0 ? scadenza : [emptyScadenzaRow()];
                setScadenzaEntries(
                    mappedScadenza.map((item, idx) => ({
                        id: item.id || `scad-${Date.now()}-${idx}`,
                        istitutoDiCredito: item.istitutoDiCredito || "",
                        formaTecnica: item.formaTecnica || "",
                        importoOriginario: item.importoOriginario || "",
                        importoResiduo: item.importoResiduo || "",
                        periodicitaRata: item.periodicitaRata || "",
                        importoRata: item.importoRata || "",
                        scadenza: item.scadenza || "",
                    }))
                );
            }
        }
    }, [value]);

    //
    // Notificar cambios al padre
    //
    const notifyChange = (breveList, scadenzaList) => {
        if (onChange) {
            onChange({ breve: breveList, scadenza: scadenzaList });
        }
    };

    //
    // Handlers para "Affidamenti a Breve"
    //
    const handleChangeBreve = (id, field, val) => {
        const updated = breveEntries.map((row) =>
            row.id === id ? { ...row, [field]: val } : row
        );
        setBreveEntries(updated);
        notifyChange(updated, scadenzaEntries);
    };

    const handleAddBreve = () => {
        const newRow = { ...emptyBreveRow(), id: `breve-${Date.now()}` };
        const updated = [...breveEntries, newRow];
        setBreveEntries(updated);
        notifyChange(updated, scadenzaEntries);
    };

    const handleRemoveBreve = (id, idx) => {
        // No eliminar si es la primera fila (idx=0) o si solo queda una fila
        if (idx === 0 || breveEntries.length === 1) return;
        const updated = breveEntries.filter((row) => row.id !== id);
        setBreveEntries(updated);
        notifyChange(updated, scadenzaEntries);
    };

    //
    // Handlers para "Affidamenti a Scadenza"
    //
    const handleChangeScadenza = (id, field, val) => {
        const updated = scadenzaEntries.map((row) =>
            row.id === id ? { ...row, [field]: val } : row
        );
        setScadenzaEntries(updated);
        notifyChange(breveEntries, updated);
    };

    const handleAddScadenza = () => {
        const newRow = { ...emptyScadenzaRow(), id: `scad-${Date.now()}` };
        const updated = [...scadenzaEntries, newRow];
        setScadenzaEntries(updated);
        notifyChange(breveEntries, updated);
    };

    const handleRemoveScadenza = (id, idx) => {
        // No eliminar si es la primera fila (idx=0) o si solo queda una fila
        if (idx === 0 || scadenzaEntries.length === 1) return;
        const updated = scadenzaEntries.filter((row) => row.id !== id);
        setScadenzaEntries(updated);
        notifyChange(breveEntries, updated);
    };

    //
    // Cálculo de totales
    //  - Breve: sumamos "importoAccordato" y "importoUtilizzato"
    //  - Scadenza: sumamos "importoOriginario" y "importoResiduo"
    //
    const totalBreveAccordato = breveEntries.reduce(
        (acc, row) => acc + (parseFloat(row.importoAccordato) || 0),
        0
    );
    const totalBreveUtilizzato = breveEntries.reduce(
        (acc, row) => acc + (parseFloat(row.importoUtilizzato) || 0),
        0
    );

    const totalScadenzaOriginario = scadenzaEntries.reduce(
        (acc, row) => acc + (parseFloat(row.importoOriginario) || 0),
        0
    );
    const totalScadenzaResiduo = scadenzaEntries.reduce(
        (acc, row) => acc + (parseFloat(row.importoResiduo) || 0),
        0
    );

    //
    // Render de la sección de crediti / botones toggle
    //
    const renderCreditiToggle = () => (
        <div className="option-grid__toggle">
            <span>Hai crediti?</span>
            <ToggleButtonGroup
                options={[
                    { label: "Sì", value: true },
                    { label: "No", value: false }
                ]}
                activeValue={hasCrediti}
                onChange={handleHasCrediti}
            />
        </div>
    );

    //
    // Render de cada sección
    //
    const renderAffidamentiBreve = () => (
        <div className="affidamento-sezione">
            <h3 className="affidamento-sezione__title">Affidamenti a Breve</h3>

            <div className="cda-grid-container">
                <div className="cda-grid-table">
                    {/* Cabecera */}
                    <div className="option-grid__column-titles">
                        <div className="option-grid__column-title cda-column-width-denominazione">
                            Istituto di Credito
                        </div>
                        <div className="option-grid__column-title cda-column-width-denominazione">
                            Forma Tecnica
                        </div>
                        <div className="option-grid__column-title cda-column-width-fatturato">
                            Importo Accordato
                        </div>
                        <div className="option-grid__column-title cda-column-width-fatturato">
                            Importo Utilizzato
                        </div>
                        <div className="option-grid__column-title cda-column-width-denominazione">
                            Tipologia
                        </div>
                        <div className="option-grid__column-title cda-column-width-denominazione">
                            Garanzia Accessoria
                        </div>
                        <div className="option-grid__column-title cda-column-width-calc">
                            {/* Espacio para botón eliminar */}
                        </div>
                    </div>

                    {/* Filas */}
                    <div className="cda-grid-body">
                        {breveEntries.map((row, idx) => {
                            const isFirstRow = idx === 0;
                            return (
                                <div key={row.id} className="option-grid__row">
                                    {/* Istituto di Credito */}
                                    <div className="option-grid__column cda-column-width-denominazione">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="text"
                                                placeholder="Istituto"
                                                value={row.istitutoDiCredito}
                                                onChange={(e) =>
                                                    handleChangeBreve(row.id, "istitutoDiCredito", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Forma Tecnica */}
                                    <div className="option-grid__column cda-column-width-denominazione">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="text"
                                                placeholder="Forma"
                                                value={row.formaTecnica}
                                                onChange={(e) =>
                                                    handleChangeBreve(row.id, "formaTecnica", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Importo Accordato */}
                                    <div className="option-grid__column cda-column-width-fatturato">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="number"
                                                placeholder="Accordato"
                                                value={row.importoAccordato}
                                                onChange={(e) =>
                                                    handleChangeBreve(row.id, "importoAccordato", e.target.value)
                                                }
                                                onWheelCapture={(e) => e.preventDefault()}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Importo Utilizzato */}
                                    <div className="option-grid__column cda-column-width-fatturato">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="number"
                                                placeholder="Utilizzato"
                                                value={row.importoUtilizzato}
                                                onChange={(e) =>
                                                    handleChangeBreve(row.id, "importoUtilizzato", e.target.value)
                                                }
                                                onWheelCapture={(e) => e.preventDefault()}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Tipologia */}
                                    <div className="option-grid__column cda-column-width-denominazione">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="text"
                                                placeholder="Tipologia"
                                                value={row.tipologia}
                                                onChange={(e) =>
                                                    handleChangeBreve(row.id, "tipologia", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Garanzia Accessoria */}
                                    <div className="option-grid__column cda-column-width-denominazione">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="text"
                                                placeholder="Garanzia"
                                                value={row.garanziaAccessoria}
                                                onChange={(e) =>
                                                    handleChangeBreve(row.id, "garanziaAccessoria", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Botón eliminar (no aparece si es la primera fila o si hay solo 1 fila) */}
                                    <div className="option-grid__column cda-column-width-calc">
                                        {(breveEntries.length > 1 && !isFirstRow) && (
                                            <button
                                                type="button"
                                                className="cda-impresa-header_option-grid__remove-btn"
                                                onClick={() => handleRemoveBreve(row.id, idx)}
                                                title="Elimina riga"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Fila de totales (similar a CalcoloDimensioneAziendale) */}
                        <div className="option-grid__row cda-totali-row">
                            {/* col1 y col2 vacíos */}
                            <div className="option-grid__column cda-column-width-denominazione"></div>
                            <div className="option-grid__column cda-column-width-denominazione cda-totale-label">
                                {/* <div className="option-grid__input-pill"> */}
                                <strong>Totale</strong>
                                {/* </div> */}
                            </div>

                            {/* col3: total importoAccordato */}
                            <div className="option-grid__column cda-column-width-fatturato">
                                <div className="option-grid__input-pill">
                                    <span>
                                        {totalBreveAccordato.toLocaleString("it-IT", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* col4: total importoUtilizzato */}
                            <div className="option-grid__column cda-column-width-fatturato">
                                <div className="option-grid__input-pill">
                                    <span>
                                        {totalBreveUtilizzato.toLocaleString("it-IT", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* col5: "Totale" */}
                            <div className="option-grid__column cda-column-width-denominazione ">

                            </div>

                            {/* col6 y col7 vacíos */}
                            <div className="option-grid__column cda-column-width-denominazione"></div>
                            <div className="option-grid__column cda-column-width-calc"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón para añadir fila a Breve */}
            <div className="option-grid__add-row">
                <button type="button" className="add-row-button" onClick={handleAddBreve}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Aggiungi scopo e valenza</span>
                </button>
            </div>
        </div>
    );

    const renderAffidamentiScadenza = () => (
        <div className="affidamento-sezione">
            <h3 className="affidamento-sezione__title">Affidamenti a Scadenza</h3>

            <div className="cda-grid-container">
                <div className="cda-grid-table">
                    {/* Cabecera */}
                    <div className="option-grid__column-titles">
                        <div className="option-grid__column-title cda-column-width-denominazione">
                            Istituto di Credito
                        </div>
                        <div className="option-grid__column-title cda-column-width-denominazione">
                            Forma Tecnica
                        </div>
                        <div className="option-grid__column-title cda-column-width-fatturato">
                            Importo Originario
                        </div>
                        <div className="option-grid__column-title cda-column-width-fatturato">
                            Importo Residuo
                        </div>
                        <div className="option-grid__column-title cda-column-width-denominazione">
                            Periodicità Rata
                        </div>
                        <div className="option-grid__column-title cda-column-width-fatturato">
                            Importo Rata
                        </div>
                        <div className="option-grid__column-title cda-column-width-denominazione">
                            Scadenza
                        </div>
                        <div className="option-grid__column-title cda-column-width-calc">
                            {/* Espacio para botón eliminar */}
                        </div>
                    </div>

                    {/* Filas */}
                    <div className="cda-grid-body">
                        {scadenzaEntries.map((row, idx) => {
                            const isFirstRow = idx === 0;
                            return (
                                <div key={row.id} className="option-grid__row">
                                    {/* Istituto di Credito */}
                                    <div className="option-grid__column cda-column-width-denominazione">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="text"
                                                placeholder="Istituto"
                                                value={row.istitutoDiCredito}
                                                onChange={(e) =>
                                                    handleChangeScadenza(row.id, "istitutoDiCredito", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Forma Tecnica */}
                                    <div className="option-grid__column cda-column-width-denominazione">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="text"
                                                placeholder="Forma"
                                                value={row.formaTecnica}
                                                onChange={(e) =>
                                                    handleChangeScadenza(row.id, "formaTecnica", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Importo Originario */}
                                    <div className="option-grid__column cda-column-width-fatturato">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="number"
                                                placeholder="Originario"
                                                value={row.importoOriginario}
                                                onChange={(e) =>
                                                    handleChangeScadenza(row.id, "importoOriginario", e.target.value)
                                                }
                                                onWheelCapture={(e) => e.preventDefault()}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Importo Residuo */}
                                    <div className="option-grid__column cda-column-width-fatturato">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="number"
                                                placeholder="Residuo"
                                                value={row.importoResiduo}
                                                onChange={(e) =>
                                                    handleChangeScadenza(row.id, "importoResiduo", e.target.value)
                                                }
                                                onWheelCapture={(e) => e.preventDefault()}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Periodicità Rata */}
                                    <div className="option-grid__column cda-column-width-denominazione">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="text"
                                                placeholder="Periodicità"
                                                value={row.periodicitaRata}
                                                onChange={(e) =>
                                                    handleChangeScadenza(row.id, "periodicitaRata", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Importo Rata */}
                                    <div className="option-grid__column cda-column-width-fatturato">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="number"
                                                placeholder="Rata"
                                                value={row.importoRata}
                                                onChange={(e) =>
                                                    handleChangeScadenza(row.id, "importoRata", e.target.value)
                                                }
                                                onWheelCapture={(e) => e.preventDefault()}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Scadenza */}
                                    <div className="option-grid__column cda-column-width-denominazione">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="text"
                                                placeholder="Scadenza"
                                                value={row.scadenza}
                                                onChange={(e) =>
                                                    handleChangeScadenza(row.id, "scadenza", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Botón eliminar (no aparece si es la primera fila o si hay solo 1 fila) */}
                                    <div className="option-grid__column cda-column-width-calc">
                                        {(scadenzaEntries.length > 1 && !isFirstRow) && (
                                            <button
                                                type="button"
                                                className="cda-impresa-header_option-grid__remove-btn"
                                                onClick={() => handleRemoveScadenza(row.id, idx)}
                                                title="Elimina riga"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Fila de totales */}
                        <div className="option-grid__row cda-totali-row">
                            {/* col1 y col2 vacíos */}
                            <div className="option-grid__column cda-column-width-denominazione"></div>
                            <div className="option-grid__column cda-column-width-denominazione  cda-totale-label">
                                {/* <div className="option-grid__input-pill"> */}
                                <strong>Totale</strong>
                                {/* </div> */}
                            </div>

                            {/* col3: total importoOriginario */}
                            <div className="option-grid__column cda-column-width-fatturato">
                                <div className="option-grid__input-pill">
                                    <span>
                                        {totalScadenzaOriginario.toLocaleString("it-IT", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* col4: total importoResiduo */}
                            <div className="option-grid__column cda-column-width-fatturato">
                                <div className="option-grid__input-pill">
                                    <span>
                                        {totalScadenzaResiduo.toLocaleString("it-IT", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* col5 y col6 vacíos */}
                            <div className="option-grid__column cda-column-width-denominazione"></div>
                            <div className="option-grid__column cda-column-width-fatturato"></div>

                            {/* col7: "Totale" */}
                            <div className="option-grid__column cda-column-width-denominazione">

                            </div>

                            {/* col8 vacío */}
                            <div className="option-grid__column cda-column-width-calc"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón para añadir fila a Scadenza */}
            <div className="option-grid__add-row">
                <button type="button" className="add-row-button" onClick={handleAddScadenza}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Aggiungi scopo e valenza</span>
                </button>
            </div>
        </div>
    );

    //
    // Render principal
    //
    return (
        <div className="calcolo-dimensione-aziendale elenco-affidamenti-bancari-leasing">
            {/* Título principal */}
            {mainLabel && (<div className="option-grid__label">{mainLabel}</div>)}
            {/* Sección de selección de crediti (siempre visible) */}
            {renderCreditiToggle()}

            {/* Mostrar contenido según la selección */}
            {hasCrediti === false && (
                <p>Non sono stati inseriti crediti. I dati sono stati precompilati.</p>
            )}
            {hasCrediti === true && (
                <>
                    {renderAffidamentiBreve()}
                    {renderAffidamentiScadenza()}
                </>
            )}
        </div>
    );
}
