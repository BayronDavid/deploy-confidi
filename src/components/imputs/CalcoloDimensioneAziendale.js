"use client";
import React, { useState, useEffect } from "react";
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
    anno1: "2022",
    anno2: "2023",
    fatturatoAnno1: "",
    fatturatoAnno2: "",
    attivoAnno1: "",
    attivoAnno2: "",
    occupatiAnno1: "",
    occupatiAnno2: "",
    tipoRelazioneAnno1: "richiedente",
    tipoRelazioneAnno2: "richiedente",
    percentualeAssociazioneAnno1: "100",
    percentualeAssociazioneAnno2: "100",
  },
  // Lista inicial de empresas opcionales
  initialImprese = [],
  mainLabel = "Impresa Richiedente",
  addButtonLabel = "Aggiungi Impresa Collegata o associata",
  onChange,
  value, // Agregar el prop value que viene del sistema de formularios
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
      tipoRelazioneAnno1: item.tipoRelazioneAnno1 || "associata",
      tipoRelazioneAnno2: item.tipoRelazioneAnno2 || "associata",
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

  // Efecto para inicializar datos desde el valor proporcionado por el sistema
  useEffect(() => {
    // Si hay un valor existente del formulario, lo usamos para inicializar
    if (value && typeof value === 'object') {
      // Si tiene la estructura correcta con richiedente e imprese
      if (value.richiedente) {
        setRichiedente(prevRichiedente => ({
          ...prevRichiedente,
          ...value.richiedente
        }));
      }
      
      // Si tiene datos de empresas
      if (Array.isArray(value.imprese) && value.imprese.length > 0) {
        setImprese(value.imprese.map((item, idx) => ({
          id: item.id || `opt-${Date.now()}-${idx}`,
          tipoRelazioneAnno1: item.tipoRelazioneAnno1 || "associata",
          tipoRelazioneAnno2: item.tipoRelazioneAnno2 || "associata",
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
        })));
      }
    }
  }, []);  // Solo ejecutar al montar el componente para inicializar

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
      tipoRelazioneAnno1: "associata",
      tipoRelazioneAnno2: "associata",
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
      // Aseguramos compatibilidad con la estructura esperada por FormInput
      const formattedData = {
        richiedente: mainData,
        imprese: impreseData,
        // Añadir esta propiedad para compatibilidad con la validación en FormInput
        impresaRichiedente: {
          denominazione: mainData.denominazioneCf || ""
        }
      };
      onChange(formattedData);
    }
  };

  // ===================== LÓGICA DE CÁLCULOS =====================
  // Suma totales del grupo (empresa principal + opcionales)
  // aplicando el porcentaje de asociación si existe.
  const calculateTotals = () => {
    let totals = {
      fatturatoAnno1: 0,
      fatturatoAnno2: 0,
      attivoAnno1: 0,
      attivoAnno2: 0,
      occupatiAnno1: 0,
      occupatiAnno2: 0,
    };

    // Empresa principal (100% siempre)
    if (richiedente.fatturatoAnno1) {
      totals.fatturatoAnno1 += Number(richiedente.fatturatoAnno1);
    }
    if (richiedente.fatturatoAnno2) {
      totals.fatturatoAnno2 += Number(richiedente.fatturatoAnno2);
    }
    if (richiedente.attivoAnno1) {
      totals.attivoAnno1 += Number(richiedente.attivoAnno1);
    }
    if (richiedente.attivoAnno2) {
      totals.attivoAnno2 += Number(richiedente.attivoAnno2);
    }
    if (richiedente.occupatiAnno1) {
      totals.occupatiAnno1 += Number(richiedente.occupatiAnno1);
    }
    if (richiedente.occupatiAnno2) {
      totals.occupatiAnno2 += Number(richiedente.occupatiAnno2);
    }

    // Empresas opcionales
    imprese.forEach((imp) => {
      const pA1 = imp.percentualeAssociazioneAnno1
        ? Number(imp.percentualeAssociazioneAnno1)
        : 0;
      const pA2 = imp.percentualeAssociazioneAnno2
        ? Number(imp.percentualeAssociazioneAnno2)
        : 0;

      // Fatturato
      if (imp.fatturatoAnno1) {
        totals.fatturatoAnno1 +=
          (Number(imp.fatturatoAnno1) * pA1) / 100;
      }
      if (imp.fatturatoAnno2) {
        totals.fatturatoAnno2 +=
          (Number(imp.fatturatoAnno2) * pA2) / 100;
      }

      // Attivo
      if (imp.attivoAnno1) {
        totals.attivoAnno1 +=
          (Number(imp.attivoAnno1) * pA1) / 100;
      }
      if (imp.attivoAnno2) {
        totals.attivoAnno2 +=
          (Number(imp.attivoAnno2) * pA2) / 100;
      }

      // Occupati
      if (imp.occupatiAnno1) {
        totals.occupatiAnno1 +=
          (Number(imp.occupatiAnno1) * pA1) / 100;
      }
      if (imp.occupatiAnno2) {
        totals.occupatiAnno2 +=
          (Number(imp.occupatiAnno2) * pA2) / 100;
      }
    });

    return totals;
  };

  // Calcula el porcentaje de cada empresa respecto al total del grupo
  // (Por cada año y por cada métrica: Fatturato, Attivo, Occupati).
  const groupTotals = calculateTotals();

  // Función para obtener el "valor parcial" de la empresa en base al % de asociación
  // (si es la principal, es 100%).
  const getEnterprisePartialValue = (company, field, year, isMain) => {
    if (isMain) {
      // 100% siempre
      return Number(company[field]) || 0;
    }
    const p = year === 1
      ? Number(company.percentualeAssociazioneAnno1) || 0
      : Number(company.percentualeAssociazioneAnno2) || 0;
    const val = Number(company[field]) || 0;
    return (val * p) / 100;
  };

  // Para calcular el % final: (valor parcial / total) * 100
  const getPercentageOfGroup = (partialValue, total) => {
    if (!total || total === 0) return 0;
    return (partialValue / total) * 100;
  };

  // Renderiza las DOS FILAS (Año 1 / Año 2) para cada empresa
  // con las 10 columnas requeridas, sustituyendo "Auto" por el cálculo real.
  const renderCompanyRows = (company, isMain = false) => {
    // =========== PREPARA valores PARCIALES para cada AÑO ===========
    // Año 1
    const partialFatturatoA1 = getEnterprisePartialValue(
      company,
      "fatturatoAnno1",
      1,
      isMain
    );
    const partialAttivoA1 = getEnterprisePartialValue(
      company,
      "attivoAnno1",
      1,
      isMain
    );
    const partialOccupatiA1 = getEnterprisePartialValue(
      company,
      "occupatiAnno1",
      1,
      isMain
    );

    // Año 2
    const partialFatturatoA2 = getEnterprisePartialValue(
      company,
      "fatturatoAnno2",
      2,
      isMain
    );
    const partialAttivoA2 = getEnterprisePartialValue(
      company,
      "attivoAnno2",
      2,
      isMain
    );
    const partialOccupatiA2 = getEnterprisePartialValue(
      company,
      "occupatiAnno2",
      2,
      isMain
    );

    // =========== CALCULA porcentaje de cada uno en el grupo ===========
    // Año 1
    const fatturatoPercA1 = getPercentageOfGroup(
      partialFatturatoA1,
      groupTotals.fatturatoAnno1
    );
    const attivoPercA1 = getPercentageOfGroup(
      partialAttivoA1,
      groupTotals.attivoAnno1
    );
    const occupatiPercA1 = getPercentageOfGroup(
      partialOccupatiA1,
      groupTotals.occupatiAnno1
    );

    // Año 2
    const fatturatoPercA2 = getPercentageOfGroup(
      partialFatturatoA2,
      groupTotals.fatturatoAnno2
    );
    const attivoPercA2 = getPercentageOfGroup(
      partialAttivoA2,
      groupTotals.attivoAnno2
    );
    const occupatiPercA2 = getPercentageOfGroup(
      partialOccupatiA2,
      groupTotals.occupatiAnno2
    );

    // Extraemos campos para facilitar lectura
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
      tipoRelazioneAnno1,
      tipoRelazioneAnno2,
      percentualeAssociazioneAnno1,
      percentualeAssociazioneAnno2,
    } = company;

    // Fila 1 (Año 1)
    const rowAnno1 = (
      <div className="option-grid__row">
        {/* (1) Denominazione e C.F. Impresa */}
        <div className="option-grid__column cda-column-width-denominazione">
          <div className="option-grid__input-pill">
            {/* Solo se muestra en la fila del año 1 */}
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

        {/* (6) Relazione & Collegamento - Anno 1 */}
        <div className="option-grid__column cda-column-width-relazione">
          {isMain ? (
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
              value={tipoRelazioneAnno1}
              onChange={(val) =>
                handleChangeImpresa(company.id, "tipoRelazioneAnno1", val)
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
              value={isMain ? "100" : percentualeAssociazioneAnno1}
              onChange={(e) =>
                isMain
                  ? null // No permitir cambios para la empresa principal
                  : handleChangeImpresa(
                    company.id,
                    "percentualeAssociazioneAnno1",
                    e.target.value
                  )
              }
              readOnly={isMain}
            />
          </div>
        </div>

        {/* (8) Fatturato % (Imp./Gr.Rel.) (Año 1) => cálculo real */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                fatturatoPercA1 > 0
                  ? `${fatturatoPercA1.toFixed(2)}%`
                  : "0%"
              }
            />
          </div>
        </div>

        {/* (9) Attivo % (Imp./Gr.Rel.) (Año 1) => cálculo real */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                attivoPercA1 > 0
                  ? `${attivoPercA1.toFixed(2)}%`
                  : "0%"
              }
            />
          </div>
        </div>

        {/* (10) Occupati % (Imp./Gr.Rel.) (Año 1) => cálculo real */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                occupatiPercA1 > 0
                  ? `${occupatiPercA1.toFixed(2)}%`
                  : "0%"
              }
            />
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

        {/* (6) Relazione & Collegamento - Anno 2 */}
        <div className="option-grid__column cda-column-width-relazione">
          {isMain ? (
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
              value={tipoRelazioneAnno2}
              onChange={(val) =>
                handleChangeImpresa(company.id, "tipoRelazioneAnno2", val)
              }
              width="100%"
              floatingOptions
            />
          )}
        </div>

        {/* (7) % di Associazione (Año 2) */}
        <div className="option-grid__column cda-column-width-percentuale">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="% A2"
              value={isMain ? "100" : percentualeAssociazioneAnno2}
              onChange={(e) =>
                isMain
                  ? null // No permitir cambios para la empresa principal
                  : handleChangeImpresa(
                    company.id,
                    "percentualeAssociazioneAnno2",
                    e.target.value
                  )
              }
              readOnly={isMain}
            />
          </div>
        </div>

        {/* (8) Fatturato % (Imp./Gr.Rel.) (Año 2) => cálculo real */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                fatturatoPercA2 > 0
                  ? `${fatturatoPercA2.toFixed(2)}%`
                  : "0%"
              }
            />
          </div>
        </div>

        {/* (9) Attivo % (Imp./Gr.Rel.) (Año 2) => cálculo real */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                attivoPercA2 > 0
                  ? `${attivoPercA2.toFixed(2)}%`
                  : "0%"
              }
            />
          </div>
        </div>

        {/* (10) Occupati % (Imp./Gr.Rel.) (Año 2) => cálculo real */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                occupatiPercA2 > 0
                  ? `${occupatiPercA2.toFixed(2)}%`
                  : "0%"
              }
            />
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

  // Render principal
  return (
    <div className="calcolo-dimensione-aziendale">
      {/* Etiqueta principal */}
      <div className="option-grid__label">{HtmlRenderer(mainLabel)}</div>

      <div className="cda-grid-container">
        {/* Estructura table-like */}
        <div className="cda-grid-table">
          {/* Cabecera con 10 columnas fijas */}
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

          {/* Cuerpo de la tabla */}
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

            {/* Totales finales (Año 1 y Año 2) */}
            <div className="cda-impresa-optional cda-totali-section">
              <div className="option-grid__list">
                {/* Total row for Anno 1 */}
                <div className="option-grid__row cda-totali-row">
                  {/* Columnas 1-5 vacías */}
                  <div className="option-grid__column cda-column-width-denominazione"></div>
                  <div className="option-grid__column cda-column-width-anno"></div>
                  <div className="option-grid__column cda-column-width-fatturato"></div>
                  <div className="option-grid__column cda-column-width-attivo"></div>
                  <div className="option-grid__column cda-column-width-occupati"></div>

                  {/* (6) => Etiqueta Totale Anno1 */}
                  <div className="option-grid__column cda-column-width-relazione">
                    <strong>Totale Anno {richiedente.anno1}</strong>
                  </div>

                  {/* (7) => Fatturato total A1 */}
                  <div className="option-grid__column cda-column-width-percentuale">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.fatturatoAnno1.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  {/* (8) => Attivo total A1 */}
                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.attivoAnno1.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  {/* (9) => Occupati total A1 */}
                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.occupatiAnno1.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* (10) => Campo "fijo" o 100% */}
                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Total row for Anno 2 */}
                <div className="option-grid__row cda-totali-row">
                  {/* Columnas 1-5 vacías */}
                  <div className="option-grid__column cda-column-width-denominazione"></div>
                  <div className="option-grid__column cda-column-width-anno"></div>
                  <div className="option-grid__column cda-column-width-fatturato"></div>
                  <div className="option-grid__column cda-column-width-attivo"></div>
                  <div className="option-grid__column cda-column-width-occupati"></div>

                  {/* (6) => Etiqueta Totale Anno2 */}
                  <div className="option-grid__column cda-column-width-relazione">
                    <strong>Totale Anno {richiedente.anno2}</strong>
                  </div>

                  {/* (7) => Fatturato total A2 */}
                  <div className="option-grid__column cda-column-width-percentuale">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.fatturatoAnno2.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  {/* (8) => Attivo total A2 */}
                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.attivoAnno2.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  {/* (9) => Occupati total A2 */}
                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.occupatiAnno2.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* (10) => Campo "fijo" o 100% */}
                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
}
