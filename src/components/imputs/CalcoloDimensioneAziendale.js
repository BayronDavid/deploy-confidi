"use client";
import React, { useState } from "react";
import "./DynamicInputGrid.css";
import "./CalcoloDimensioneAziendale.css";
import HtmlRenderer from "@/utils/HtmlRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomSelector from "./CustomSelector";

export default function CalcoloDimensioneAziendale({
  // Datos iniciales para la empresa principal
  initialRichiedente = {
    denominazioneCf: "",
    anno1: "2022", // Se mostrarán, pero no serán editables
    anno2: "2023",
    fatturatoAnno1: "",
    fatturatoAnno2: "",
    attivoAnno1: "",
    attivoAnno2: "",
    occupatiAnno1: "",
    occupatiAnno2: "",
    tipoRelazione: "richiedente",
    percentualeAssociazioneAnno1: "",
    percentualeAssociazioneAnno2: "",
  },
  // Lista inicial de empresas opcionales
  initialImprese = [],
  mainLabel = "Impresa Richiedente",
  addButtonLabel = "Aggiungi Impresa Collegata o associata",
  onChange,
}) {
  // Opciones para la relación entre empresas
  const tipoRelazioneOptions = [
    { value: "richiedente", label: "Richiedente" },
    { value: "associata", label: "Associata" },
    { value: "collegata", label: "Collegata" },
    { value: "associata_di_collegata", label: "Associata di Collegata" },
    { value: "collegata_di_associata", label: "Collegata di Associata" },
    { value: "collegata_di_collegata", label: "Collegata di Collegata" },
    { value: "collegata_persona_fisica", label: "Collegata Persona Fisica" },
  ];

  // Estado para la empresa principal y las opcionales
  const [richiedente, setRichiedente] = useState(initialRichiedente);

  const [imprese, setImprese] = useState(
    initialImprese.map((item, idx) => ({
      id: `opt-${Date.now()}-${idx}`,
      tipoRelazione: item.tipoRelazione || "associata",
      denominazioneCf: item.denominazioneCf || "",
      anno1: item.anno1 || "2022",
      anno2: item.anno2 || "2023",
      fatturatoAnno1: item.fatturatoAnno1 || "",
      fatturatoAnno2: item.fatturatoAnno2 || "",
      attivoAnno1: item.attivoAnno1 || "",
      attivoAnno2: item.attivoAnno2 || "",
      occupatiAnno1: item.occupatiAnno1 || "",
      occupatiAnno2: item.occupatiAnno2 || "",
      percentualeAssociazioneAnno1: item.percentualeAssociazioneAnno1 || "",
      percentualeAssociazioneAnno2: item.percentualeAssociazioneAnno2 || "",
    }))
  );

  // HANDLERS
  const handleChangeRichiedente = (field, value) => {
    const updated = { ...richiedente, [field]: value };
    setRichiedente(updated);
    notifyChange(updated, imprese);
  };

  const handleChangeImpresa = (id, field, value) => {
    const updated = imprese.map((imp) =>
      imp.id === id ? { ...imp, [field]: value } : imp
    );
    setImprese(updated);
    notifyChange(richiedente, updated);
  };

  const handleAddImpresa = () => {
    const newImpresa = {
      id: `opt-${Date.now()}`,
      tipoRelazione: "associata",
      denominazioneCf: "",
      anno1: "2022",
      anno2: "2023",
      fatturatoAnno1: "",
      fatturatoAnno2: "",
      attivoAnno1: "",
      attivoAnno2: "",
      occupatiAnno1: "",
      occupatiAnno2: "",
      percentualeAssociazioneAnno1: "",
      percentualeAssociazioneAnno2: "",
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

  const notifyChange = (mainData, impreseData) => {
    if (onChange) {
      onChange({
        richiedente: mainData,
        imprese: impreseData,
      });
    }
  };

  // Ejemplo de cálculo de totales (puedes adaptarlo a tu lógica)
  const calculateTotals = () => {
    return {
      fatturatoAnno1: 0,
      fatturatoAnno2: 0,
      attivoAnno1: 0,
      attivoAnno2: 0,
      occupatiAnno1: 0,
      occupatiAnno2: 0,
    };
  };

  // Renderiza las DOS FILAS (Año 1 / Año 2) para cada empresa,
  // con las 10 columnas requeridas:
  // 1) Denominazione e C.F. Impresa
  // 2) Anno di Riferimento (solo lectura)
  // 3) Fatturato
  // 4) Attivo
  // 5) Occupati (ULA)
  // 6) Relazione & Collegamento
  // 7) % di Associazione
  // 8) Fatturato % (Imp./Gr.Rel.)
  // 9) Attivo % (Imp./Gr.Rel.)
  // 10) Occupati % (Imp./Gr.Rel.)
  const renderCompanyRows = (company, isMain = false) => {
    // Para simplificar, los % (Imp./Gr.Rel.) se muestran como "Auto" o "Completo Automatico"
    // Ajusta a tu lógica de cálculo si deseas algo real.
    const {
      denominazioneCf,
      anno1,
      anno2,
      fatturatoAnno1,
      fatturatoAnno2,
      attivoAnno1,
      attivoAnno2,
      occupatiAnno1,
      occupatiAnno2,
      tipoRelazione,
      percentualeAssociazioneAnno1,
      percentualeAssociazioneAnno2,
    } = company;

    // Fila 1 (Año 1)
    const rowAnno1 = (
      <div className="option-grid__row">
        {/* (1) Denominazione e C.F. Impresa */}
        <div className="option-grid__column cda-column-width-denominazione">
          <div className="option-grid__input-pill">
            <input
              type="text"
              placeholder="Denominazione"
              value={denominazioneCf}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("denominazioneCf", e.target.value)
                  : handleChangeImpresa(company.id, "denominazioneCf", e.target.value)
              }
            />
          </div>
        </div>

        {/* (2) Anno di Riferimento => Anno1 (no editable) */}
        <div className="option-grid__column cda-column-width-anno">
          <div className="option-grid__input-pill">
            <span>Anno {anno1}</span>
          </div>
        </div>

        {/* (3) Fatturato (Año 1) */}
        <div className="option-grid__column cda-column-width-fatturato">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="Fatt. A1"
              value={fatturatoAnno1}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("fatturatoAnno1", e.target.value)
                  : handleChangeImpresa(company.id, "fatturatoAnno1", e.target.value)
              }
            />
          </div>
        </div>

        {/* (4) Attivo (Año 1) */}
        <div className="option-grid__column cda-column-width-attivo">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="Att. A1"
              value={attivoAnno1}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("attivoAnno1", e.target.value)
                  : handleChangeImpresa(company.id, "attivoAnno1", e.target.value)
              }
            />
          </div>
        </div>

        {/* (5) Occupati (Año 1) */}
        <div className="option-grid__column cda-column-width-occupati">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="Occ. A1"
              value={occupatiAnno1}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("occupatiAnno1", e.target.value)
                  : handleChangeImpresa(company.id, "occupatiAnno1", e.target.value)
              }
            />
          </div>
        </div>

        {/* (6) Relazione & Collegamento */}
        <div className="option-grid__column cda-column-width-relazione">
          {tipoRelazione === "richiedente" ? (
            <CustomSelector
              label="Relazione"
              options={[{ value: "richiedente", label: "Richiedente" }]}
              value="richiedente"
              disabled
              width="100%"
            />
          ) : (
            <CustomSelector
              label="Relazione"
              options={tipoRelazioneOptions.filter(
                (opt) => opt.value !== "richiedente"
              )}
              value={tipoRelazione}
              onChange={(val) =>
                handleChangeImpresa(company.id, "tipoRelazione", val)
              }
              width="100%"
              floatingOptions
            />
          )}
        </div>

        {/* (7) % di Associazione (Año 1) */}
        <div className="option-grid__column cda-column-width-percentuale">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="% A1"
              value={percentualeAssociazioneAnno1}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("percentualeAssociazioneAnno1", e.target.value)
                  : handleChangeImpresa(
                    company.id,
                    "percentualeAssociazioneAnno1",
                    e.target.value
                  )
              }
            />
          </div>
        </div>

        {/* (8) Fatturato % (Imp./Gr.Rel.) (Año 1) => ejemplo "Auto" */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input type="text" readOnly value="Auto" />
          </div>
        </div>

        {/* (9) Attivo % (Imp./Gr.Rel.) (Año 1) => ejemplo "Auto" */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input type="text" readOnly value="Auto" />
          </div>
        </div>

        {/* (10) Occupati % (Imp./Gr.Rel.) (Año 1) => ejemplo "Auto" */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input type="text" readOnly value="Auto" />
          </div>
        </div>
      </div>
    );

    // Fila 2 (Año 2)
    const rowAnno2 = (
      <div className="option-grid__row">
        {/* (1) Denominazione e C.F. Impresa => vacío en la 2da fila */}
        <div className="option-grid__column cda-column-width-denominazione"></div>

        {/* (2) Anno di Riferimento => Anno2 (no editable) */}
        <div className="option-grid__column cda-column-width-anno">
          <div className="option-grid__input-pill">
            <span>Anno {anno2}</span>
          </div>
        </div>

        {/* (3) Fatturato (Año 2) */}
        <div className="option-grid__column cda-column-width-fatturato">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="Fatt. A2"
              value={fatturatoAnno2}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("fatturatoAnno2", e.target.value)
                  : handleChangeImpresa(company.id, "fatturatoAnno2", e.target.value)
              }
            />
          </div>
        </div>

        {/* (4) Attivo (Año 2) */}
        <div className="option-grid__column cda-column-width-attivo">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="Att. A2"
              value={attivoAnno2}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("attivoAnno2", e.target.value)
                  : handleChangeImpresa(company.id, "attivoAnno2", e.target.value)
              }
            />
          </div>
        </div>

        {/* (5) Occupati (Año 2) */}
        <div className="option-grid__column cda-column-width-occupati">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="Occ. A2"
              value={occupatiAnno2}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("occupatiAnno2", e.target.value)
                  : handleChangeImpresa(company.id, "occupatiAnno2", e.target.value)
              }
            />
          </div>
        </div>

        {/* (6) Relazione & Collegamento => vacío en la 2da fila */}
        <div className="option-grid__column cda-column-width-relazione"></div>

        {/* (7) % di Associazione (Año 2) */}
        <div className="option-grid__column cda-column-width-percentuale">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="% A2"
              value={percentualeAssociazioneAnno2}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("percentualeAssociazioneAnno2", e.target.value)
                  : handleChangeImpresa(
                    company.id,
                    "percentualeAssociazioneAnno2",
                    e.target.value
                  )
              }
            />
          </div>
        </div>

        {/* (8) Fatturato % (Imp./Gr.Rel.) (Año 2) => ejemplo "Auto" */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input type="text" readOnly value="Auto" />
          </div>
        </div>

        {/* (9) Attivo % (Imp./Gr.Rel.) (Año 2) => ejemplo "Auto" */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input type="text" readOnly value="Auto" />
          </div>
        </div>

        {/* (10) Occupati % (Imp./Gr.Rel.) (Año 2) => ejemplo "Auto" */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input type="text" readOnly value="Auto" />
          </div>
        </div>
      </div>
    );

    return (
      <>
        {rowAnno1}
        {rowAnno2}
      </>
    );
  };

  // Render de la sección Totali - Moved back inside the component
  const renderTotals = () => {
    const totals = calculateTotals();
    return (
      <div className="cda-totali">
        <h3 className="cda-title">Totali</h3>
        <div className="cda-grid-container">
          <div className="cda-grid-table">
            <div className="option-grid__column-titles">
              <div className="option-grid__column-title cda-column-width-anno">
                Anno di Riferimento
              </div>
              <div className="option-grid__column-title cda-column-width-fatturato">
                Fatturato
              </div>
              <div className="option-grid__column-title cda-column-width-attivo">
                Attivo
              </div>
              <div className="option-grid__column-title cda-column-width-occupati">
                Occupati
              </div>
            </div>
            <div className="cda-grid-body">
              <div className="option-grid__list">
                <div className="option-grid__row">
                  <div className="option-grid__column cda-column-width-anno">
                    <div className="option-grid__input-pill">
                      <span>Anno {richiedente.anno1}</span>
                    </div>
                  </div>
                  <div className="option-grid__column cda-column-width-fatturato">
                    <div className="option-grid__input-pill">
                      <span>{totals.fatturatoAnno1.toLocaleString()} €</span>
                    </div>
                  </div>
                  <div className="option-grid__column cda-column-width-attivo">
                    <div className="option-grid__input-pill">
                      <span>{totals.attivoAnno1.toLocaleString()} €</span>
                    </div>
                  </div>
                  <div className="option-grid__column cda-column-width-occupati">
                    <div className="option-grid__input-pill">
                      <span>{totals.occupatiAnno1.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="option-grid__row">
                  <div className="option-grid__column cda-column-width-anno">
                    <div className="option-grid__input-pill">
                      <span>Anno {richiedente.anno2}</span>
                    </div>
                  </div>
                  <div className="option-grid__column cda-column-width-fatturato">
                    <div className="option-grid__input-pill">
                      <span>{totals.fatturatoAnno2.toLocaleString()} €</span>
                    </div>
                  </div>
                  <div className="option-grid__column cda-column-width-attivo">
                    <div className="option-grid__input-pill">
                      <span>{totals.attivoAnno2.toLocaleString()} €</span>
                    </div>
                  </div>
                  <div className="option-grid__column cda-column-width-occupati">
                    <div className="option-grid__input-pill">
                      <span>{totals.occupatiAnno2.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render principal
  return (
    <div className="calcolo-dimensione-aziendale">
      {/* Etiqueta principal */}
      <div className="option-grid__label">{HtmlRenderer(mainLabel)}</div>

      <div className="cda-grid-container">
        {/* Table-like structure for perfect column alignment */}
        <div className="cda-grid-table">
          {/* Cabecera con 10 columnas */}
          <div className="option-grid__column-titles">
            <div className="option-grid__column-title cda-column-width-denominazione">
              Denominazione e C.F. Impresa
            </div>
            <div className="option-grid__column-title cda-column-width-anno">
              Anno di Riferimento
            </div>
            <div className="option-grid__column-title cda-column-width-fatturato">
              Fatturato
            </div>
            <div className="option-grid__column-title cda-column-width-attivo">
              Attivo
            </div>
            <div className="option-grid__column-title cda-column-width-occupati">
              Occupati (ULA)
            </div>
            <div className="option-grid__column-title cda-column-width-relazione">
              Relazione & Collegamento
            </div>
            <div className="option-grid__column-title cda-column-width-percentuale">
              % di Associazione
            </div>
            <div className="option-grid__column-title cda-column-width-calc">
              Fatturato % (Imp./Gr.Rel.)
            </div>
            <div className="option-grid__column-title cda-column-width-calc">
              Attivo % (Imp./Gr.Rel.)
            </div>
            <div className="option-grid__column-title cda-column-width-calc">
              Occupati % (Imp./Gr.Rel.)
            </div>
          </div>

          {/* Content rows */}
          <div className="cda-grid-body">
            {/* Empresa principal */}
            <div className="option-grid__list">
              {renderCompanyRows(richiedente, true)}
            </div>

            {/* Empresas opcionales */}
            {imprese.map((imp, idx) => (
              <div key={imp.id} className="cda-impresa-optional">
                <div className="cda-impresa-header">
                  <strong>Impresa {idx + 1}</strong>
                  <button
                    type="button"
                    className="cda-impresa-header_option-grid__remove-btn"
                    onClick={() => handleRemoveImpresa(imp.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <div className="option-grid__list">{renderCompanyRows(imp)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botón para agregar nueva empresa */}
      <div className="option-grid__add-row">
        <button type="button" className="add-row-button" onClick={handleAddImpresa}>
          <FontAwesomeIcon icon={faPlus} />
          <span>{addButtonLabel}</span>
        </button>
      </div>

      {/* Totales (opcional) */}
      {renderTotals()}
    </div>
  );
}
