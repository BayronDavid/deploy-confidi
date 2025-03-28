"use client";
import React, { useState, useEffect } from "react";
import "./ElencoProprietaImmobiliariFuoriTrento.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomSelector from "./CustomSelector"; // Ajusta la ruta según tu proyecto
import ToggleButtonGroup from "../buttons/ToggleButtonGroup";

/**
 * Componente para gestionar la lista de propiedades inmobiliarias
 * fuera de la Provincia di Trento, con las columnas:
 *   - Proprietario (CustomSelector)
 *   - Tipologia (CustomSelector)
 *   - Ubicazione Immobile (texto)
 *   - Superficie (número)
 *   - % di possesso immobile (número)
 *   - Gravami (CustomSelector)
 *   - Residuo Mutuo (número)
 *
 * Props:
 *  - initialProperties: array de propiedades iniciales
 *  - mainLabel: título principal a mostrar
 *  - onChange: callback (propertiesArray) => void
 *  - value: si llega un array de propiedades desde fuera, para controlar el estado
 */
export default function ElencoProprietaImmobiliariFuoriTrento({
    initialProperties = [],
    mainLabel = "",
    onChange,
    value,
    addButtonLabel = "Aggiungi immobile",
}) {
    // Opciones de ejemplo para los selectores
    const proprietarioOptions = [
        { value: "titolare_impresa", label: "Titolare dell'impresa" },
        { value: "impresa", label: "Impresa" },
        { value: "garante_impresa", label: "Garante dell'impresa" },
        { value: "legale_rappresentante", label: "Legale rappresentante" },
        { value: "soci_impresa", label: "Soci dell'impresa" },
    ];

    const tipologiaOptions = [
        { value: "abitazione", label: "Abitazione" },
        { value: "box", label: "Box" },
        { value: "negozio", label: "Negozio" },
        { value: "capannone", label: "Capannone" },
        { value: "terreno", label: "Terreno" },
        // Agrega más si es necesario
    ];

    const gravamiOptions = [
        { value: "ipoteca", label: "Ipoteca" },
        { value: "usufrutto", label: "Usufrutto" },
        { value: "uso_abitazione", label: "Uso Abitazione" },
        { value: "altri", label: "Altri" },
    ];

    // Estado interno para la lista de propiedades
    const [properties, setProperties] = useState(() => {
        if (initialProperties.length === 0) {
            return [{
                id: `prop-${Date.now()}`,
                proprietario: "",
                tipologia: "",
                ubicazione: "",
                superficie: "",
                percentualePossesso: "",
                gravami: "",
                residuoMutuo: "",
                nonRemovable: true
            }];
        }
        return initialProperties.map((item, idx) => ({
            id: item.id || `prop-${Date.now()}-${idx}`,
            proprietario: item.proprietario || "",
            tipologia: item.tipologia || "",
            ubicazione: item.ubicazione || "",
            superficie: item.superficie || "",
            percentualePossesso: item.percentualePossesso || "",
            gravami: item.gravami || "",
            residuoMutuo: item.residuoMutuo || "",
            // Mantenemos la bandera si existiera
            nonRemovable: item.nonRemovable || false
        }));
    });

    // Efecto para sincronizar si llega un `value` externo
    useEffect(() => {
        if (value && Array.isArray(value)) {
            if (value.length === 0) {
                setProperties([{
                    id: `prop-${Date.now()}`,
                    proprietario: "",
                    tipologia: "",
                    ubicazione: "",
                    superficie: "",
                    percentualePossesso: "",
                    gravami: "",
                    residuoMutuo: "",
                    nonRemovable: true
                }]);
            } else {
                const mapped = value.map((item, idx) => ({
                    id: item.id || `prop-${Date.now()}-${idx}`,
                    proprietario: item.proprietario || "",
                    tipologia: item.tipologia || "",
                    ubicazione: item.ubicazione || "",
                    superficie: item.superficie || "",
                    percentualePossesso: item.percentualePossesso || "",
                    gravami: item.gravami || "",
                    residuoMutuo: item.residuoMutuo || "",
                    nonRemovable: item.nonRemovable || false
                }));
                setProperties(mapped);
            }
        }
    }, [value]);

    // Nuevo estado para "Hai proprietà immobiliari?"
    const [hasImmobili, setHasImmobili] = useState(null);

    const handleHasImmobili = (answer) => {
        setHasImmobili(answer);
        if (answer === false) {
            const defaultProp = {
                id: "prop-default",
                proprietario: "Nessun immobile",
                tipologia: "",
                ubicazione: "",
                superficie: "0",
                percentualePossesso: "0",
                gravami: "",
                residuoMutuo: "0",
                nonRemovable: true
            };
            setProperties([defaultProp]);
            if (onChange) onChange([defaultProp]);
        }
    };

    const renderImmobiliToggle = () => (
        <div className="option-grid__toggle">
            <span>Hai proprietà immobiliari?</span>
            <ToggleButtonGroup
                options={[
                    { label: "Sì", value: true },
                    { label: "No", value: false }
                ]}
                activeValue={hasImmobili}
                onChange={handleHasImmobili}
            />
        </div>
    );

    // Notificar cambios al padre
    const notifyChange = (updated) => {
        if (onChange) {
            onChange(updated);
        }
    };

    // Handlers
    const handleChangeField = (id, field, newValue) => {
        const updated = properties.map((prop) =>
            prop.id === id ? { ...prop, [field]: newValue } : prop
        );
        setProperties(updated);
        notifyChange(updated);
    };

    const handleAddProperty = () => {
        const newProp = {
            id: `prop-${Date.now()}`,
            proprietario: "",
            tipologia: "",
            ubicazione: "",
            superficie: "",
            percentualePossesso: "",
            gravami: "",
            residuoMutuo: "",
            nonRemovable: false
        };
        const updated = [...properties, newProp];
        setProperties(updated);
        notifyChange(updated);
    };

    const handleRemoveProperty = (id) => {
        const updated = properties.filter((prop) => prop.id !== id);
        setProperties(updated);
        notifyChange(updated);
    };

    return (
        <div className="calcolo-dimensione-aziendale epift-container">
            {/* Etiqueta principal */}
            <div className="option-grid__label">{mainLabel}</div>

            {/* Toggle para gestionar la existencia de proprietà immobiliari */}
            {renderImmobiliToggle()}

            {/* Render condicional según la respuesta */}
            {hasImmobili === false && (
                <p>Non sono state inserite proprietà immobiliari. I dati sono stati precompilati.</p>
            )}
            {hasImmobili === true && (
                <div className="cda-grid-container">
                    <div className="cda-grid-table">
                        {/* Cabecera */}
                        <div className="option-grid__column-titles">
                            <div className="option-grid__column-title epift-col-proprietario">
                                Proprietario
                            </div>
                            <div className="option-grid__column-title epift-col-tipologia">
                                Tipologia
                            </div>
                            <div className="option-grid__column-title epift-col-ubicazione">
                                Ubicazione Immobile (Via, N. Civ, Prov)
                            </div>
                            <div className="option-grid__column-title epift-col-superficie">
                                Superficie (in Metri Quadrati)
                            </div>
                            <div className="option-grid__column-title epift-col-possesso">
                                % di possesso immobile
                            </div>
                            <div className="option-grid__column-title epift-col-gravami">
                                Gravami
                            </div>
                            <div className="option-grid__column-title epift-col-residuo">
                                Residuo Mutuo
                            </div>
                            <div className="option-grid__column-title epift-col-remove">
                                {/* Espacio para botón eliminar */}
                            </div>
                        </div>

                        {/* Cuerpo de la tabla */}
                        <div className="cda-grid-body">
                            {properties.map((prop, idx) => (
                                <div key={prop.id} className="option-grid__row">
                                    {/* Proprietario */}
                                    <div className="option-grid__column epift-col-proprietario">
                                        <CustomSelector
                                            label=""
                                            options={proprietarioOptions}
                                            value={prop.proprietario}
                                            onChange={(val) =>
                                                handleChangeField(prop.id, "proprietario", val)
                                            }
                                            width="100%"
                                            floatingOptions
                                        />
                                    </div>
                                    {/* Tipologia */}
                                    <div className="option-grid__column epift-col-tipologia">
                                        <CustomSelector
                                            label=""
                                            options={tipologiaOptions}
                                            value={prop.tipologia}
                                            onChange={(val) =>
                                                handleChangeField(prop.id, "tipologia", val)
                                            }
                                            width="100%"
                                            floatingOptions
                                        />
                                    </div>
                                    {/* Ubicazione Immobile */}
                                    <div className="option-grid__column epift-col-ubicazione">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="text"
                                                placeholder="Ubicazione"
                                                value={prop.ubicazione}
                                                onChange={(e) =>
                                                    handleChangeField(prop.id, "ubicazione", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    {/* Superficie */}
                                    <div className="option-grid__column epift-col-superficie">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="number"
                                                placeholder="MQ"
                                                value={prop.superficie}
                                                onChange={(e) =>
                                                    handleChangeField(prop.id, "superficie", e.target.value)
                                                }
                                                onWheelCapture={(e) => e.preventDefault()}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    {/* % di possesso immobile */}
                                    <div className="option-grid__column epift-col-possesso">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="number"
                                                placeholder="%"
                                                value={prop.percentualePossesso}
                                                onChange={(e) =>
                                                    handleChangeField(prop.id, "percentualePossesso", e.target.value)
                                                }
                                                onWheelCapture={(e) => e.preventDefault()}
                                                min="0"
                                                max="100"
                                            />
                                        </div>
                                    </div>
                                    {/* Gravami */}
                                    <div className="option-grid__column epift-col-gravami">
                                        <CustomSelector
                                            label=""
                                            options={gravamiOptions}
                                            value={prop.gravami}
                                            onChange={(val) =>
                                                handleChangeField(prop.id, "gravami", val)
                                            }
                                            width="100%"
                                            floatingOptions
                                        />
                                    </div>
                                    {/* Residuo Mutuo */}
                                    <div className="option-grid__column epift-col-residuo">
                                        <div className="option-grid__input-pill">
                                            <input
                                                type="number"
                                                placeholder="€"
                                                value={prop.residuoMutuo}
                                                onChange={(e) =>
                                                    handleChangeField(prop.id, "residuoMutuo", e.target.value)
                                                }
                                                onWheelCapture={(e) => e.preventDefault()}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    {/* Botón Eliminar */}
                                    <div className="option-grid__column epift-col-remove">
                                        {prop.nonRemovable ? null : (
                                            <button
                                                type="button"
                                                className="cda-impresa-header_option-grid__remove-btn"
                                                onClick={() => handleRemoveProperty(prop.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mostrar botón "Aggiungi immobile" solo si se ha seleccionado (true) */}
            {hasImmobili === true && (
                <div className="option-grid__add-row">
                    <button type="button" className="add-row-button" onClick={handleAddProperty}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>{addButtonLabel}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
