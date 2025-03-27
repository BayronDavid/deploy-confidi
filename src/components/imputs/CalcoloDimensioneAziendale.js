"use client";
import React, { useState, useEffect } from "react";
import "./DynamicInputGrid.css";
import "./CalcoloDimensioneAziendale.css";
import HtmlRenderer from "@/utils/HtmlRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import CustomSelector from "./CustomSelector";
import { useFormsContext } from "@/context/FormsContext";

// validar % di Associazione según tipo di relazione
const validatePercentualeAssociazione = (relation, value) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  // Si la relación contiene "collegata", se requiere >=50%
  if (relation.includes("collegata")) {
    return num >= 50;
  }
  // Para "associata" u otras sin "collegata", se requiere entre 25 y 50%
  return num >= 25 && num < 50;
};

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
  value,
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

  // Nuovo stato per tracciare errori di input
  const [inputErrors, setInputErrors] = useState({});

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

  // cálculo de opciones de año basado en la fecha actual:
  const today = new Date();
  const referenceYear = (today.getMonth() === 0 && today.getDate() === 1)
    ? today.getFullYear()
    : today.getFullYear() - 1;
  const annoOptions = [referenceYear.toString(), (referenceYear - 1).toString()];

  // handler para actualizar anno1 y anno2 en la empresa richiedente:
  const handleChangeAnno = (newAnno1) => {
    const newAnno1Number = Number(newAnno1);
    const updated = {
      ...richiedente,
      anno1: newAnno1.toString(),              // Año seleccionado para Anno1
      anno2: (newAnno1Number - 1).toString()     // Año calculado para Anno2
    };
    setRichiedente(updated);
    notifyChange(updated, imprese);
  };

  const { formSubmitAttempted } = useFormsContext();

  // Helper para determinar si un campo está vacío (obligatorio)
  const isFieldMissing = (val) => formSubmitAttempted && (!val || val.toString().trim() === "");

  // Modifica di handleBlur per aggiornare lo stato in modo consistente (senza alerts)
  const handleBlur = (e, min, max) => {
    const { name, value } = e.target;
    const num = Number(value);
    let errorMsg = "";
    if (num < min) {
        errorMsg = `Il valore deve essere almeno ${min}`;
    } else if (max !== undefined && num > max) {
        errorMsg = `Il valore deve essere al massimo ${max}`;
    }
    setInputErrors(prevErrors => ({ ...prevErrors, [name]: errorMsg }));
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

    // Validación para % in Año 1 y validación extra para Año 2 (aunque no sean obligatorios)
    const percentValid = isMain ? true : validatePercentualeAssociazione(tipoRelazioneAnno1, percentualeAssociazioneAnno1);
    const percentValidA2 = isMain ? true : (percentualeAssociazioneAnno2 ? validatePercentualeAssociazione(tipoRelazioneAnno2, percentualeAssociazioneAnno2) : true);

    const prefix = isMain ? "richiedente" : company.id; // per avere nomi univoci

    // Fila 1 (Año 1)
    const rowAnno1 = (
      <div className="option-grid__row">
        {/* (1) Denominazione e C.F. Impresa */}
        <div className="option-grid__column cda-column-width-denominazione">
          <div className={`option-grid__input-pill ${isFieldMissing(denominazioneCf) ? "option-grid__input-pill--error" : ""}`}>
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

        {/* (2) Anno di Riferimento */}
        <div className="option-grid__column cda-column-width-anno">
          {isMain ? (
            <CustomSelector
              label="Anno"
              options={annoOptions.map(opt => ({ value: opt, label: `${opt}` }))}
              value={richiedente.anno1}
              onChange={handleChangeAnno}
              width="100%"
              floatingOptions={true}
            />
          ) : (
            <div className="option-grid__input-pill">
              <span>{richiedente.anno1}</span>
            </div>

          )}
        </div>

        {/* (3) Fatturato (Año 1) */}
        <div className="option-grid__column cda-column-width-fatturato">
          <div className={`option-grid__input-pill ${isFieldMissing(fatturatoAnno1) || inputErrors[`${prefix}_fatturatoAnno1`] ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              name={`${prefix}_fatturatoAnno1`}
              placeholder="Fatt. A1"
              value={fatturatoAnno1}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("fatturatoAnno1", e.target.value)
                  : handleChangeImpresa(company.id, "fatturatoAnno1", e.target.value)
              }
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => handleBlur(e, 0)}
              min="0"
            />

          </div>
        </div>

        {/* (4) Attivo (Año 1) */}
        <div className="option-grid__column cda-column-width-attivo">
          <div className={`option-grid__input-pill ${isFieldMissing(attivoAnno1) || inputErrors[`${prefix}_attivoAnno1`] ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              name={`${prefix}_attivoAnno1`}
              placeholder="Att. A1"
              value={attivoAnno1}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("attivoAnno1", e.target.value)
                  : handleChangeImpresa(company.id, "attivoAnno1", e.target.value)
              }
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => handleBlur(e, 0)}
              min="0"
            />

          </div>
        </div>

        {/* (5) Occupati (Año 1) */}
        <div className="option-grid__column cda-column-width-occupati">
          <div className={`option-grid__input-pill ${isFieldMissing(occupatiAnno1) ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              placeholder="Occ. A1"
              value={occupatiAnno1}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("occupatiAnno1", e.target.value)
                  : handleChangeImpresa(company.id, "occupatiAnno1", e.target.value)
              }
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => handleBlur(e, 0)}
              min="0"
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
          <div className={`option-grid__input-pill ${!percentValid ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              name={`${prefix}_percentualeAssociazioneAnno1`}
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
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => isMain ? null : handleBlur(e, 0, 100)}
              min="0"
              max="100"
            />
           
          </div>
        </div>

        {/* (8) Fatturato * % (Año 1) */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                partialFatturatoA1 > 0
                  ? partialFatturatoA1.toFixed(2)
                  : "0"
              }
            />
          </div>
        </div>

        {/* (9) Attivo * % (Año 1) */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                partialAttivoA1 > 0
                  ? partialAttivoA1.toFixed(2)
                  : "0"
              }
            />
          </div>
        </div>

        {/* (10) Occupati * % (Año 1) */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                partialOccupatiA1 > 0
                  ? partialOccupatiA1.toFixed(2)
                  : "0"
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

        {/* (2) Anno di Riferimento - se muestra el año calculado */}
        <div className="option-grid__column cda-column-width-anno">
          <div className="option-grid__input-pill">
            {isMain ? (
              <span>{richiedente.anno2}</span>
            ) : (
              // Empresas opcionales usan el año de richiedente (corresponde a anno2)
              <span>{richiedente.anno2}</span>
            )}
          </div>
        </div>

        {/* (3) Fatturato (Año 2) */}
        <div className="option-grid__column cda-column-width-fatturato">
          <div className={`option-grid__input-pill ${inputErrors[`${prefix}_fatturatoAnno2`] ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              name={`${prefix}_fatturatoAnno2`}
              placeholder="Fatt. A2"
              value={fatturatoAnno2}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("fatturatoAnno2", e.target.value)
                  : handleChangeImpresa(company.id, "fatturatoAnno2", e.target.value)
              }
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => handleBlur(e, 0)}
              min="0"
            />

          </div>
        </div>

        {/* (4) Attivo (Año 2) */}
        <div className="option-grid__column cda-column-width-attivo">
          <div className={`option-grid__input-pill ${inputErrors[`${prefix}_attivoAnno2`] ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              name={`${prefix}_attivoAnno2`}
              placeholder="Att. A2"
              value={attivoAnno2}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("attivoAnno2", e.target.value)
                  : handleChangeImpresa(company.id, "attivoAnno2", e.target.value)
              }
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => handleBlur(e, 0)}
              min="0"
            />

          </div>
        </div>

        {/* (5) Occupati (Año 2) */}
        <div className="option-grid__column cda-column-width-occupati">
          <div className={`option-grid__input-pill ${inputErrors[`${prefix}_occupatiAnno2`] ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              placeholder="Occ. A2"
              value={occupatiAnno2}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("occupatiAnno2", e.target.value)
                  : handleChangeImpresa(company.id, "occupatiAnno2", e.target.value)
              }
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => handleBlur(e, 0)}
              min="0"
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
          <div className={`option-grid__input-pill ${!percentValidA2 ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              name={`${prefix}_percentualeAssociazioneAnno2`}
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
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => isMain ? null : handleBlur(e, 0, 100)}
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* (8) Fatturato * % (Año 2) */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                partialFatturatoA2 > 0
                  ? partialFatturatoA2.toFixed(2)
                  : "0"
              }
            />
          </div>
        </div>

        {/* (9) Attivo * % (Año 2) */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                partialAttivoA2 > 0
                  ? partialAttivoA2.toFixed(2)
                  : "0"
              }
            />
          </div>
        </div>

        {/* (10) Occupati * % (Año 2) */}
        <div className="option-grid__column cda-column-width-calc">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={
                partialOccupatiA2 > 0
                  ? partialOccupatiA2.toFixed(2)
                  : "0"
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

  // verificar campos obligatorios (Año 1) en una empresa
  const isMissingMandatory = (company) =>
    !company.denominazioneCf ||
    !company.fatturatoAnno1 ||
    !company.attivoAnno1 ||
    !company.occupatiAnno1;

  // Se marca error si la empresa principal o alguna opcional no tiene completos sus campos del Año 1
  const missingRequired = isMissingMandatory(richiedente) || imprese.some(imp => isMissingMandatory(imp));
  const showWarning = formSubmitAttempted && missingRequired;

  // acumular retroalimentación específica del % di Associazione
  const percentFeedbackMessages = imprese.reduce((msgs, imp, idx) => {
    if (!validatePercentualeAssociazione(imp.tipoRelazioneAnno1, imp.percentualeAssociazioneAnno1)) {
      const guideline = imp.tipoRelazioneAnno1.includes("collegata")
        ? "minimo 50%"
        : "compreso tra 25% e 50%";
      msgs.push(`Impresa ${idx + 1} (Anno 1): % di Associazione è ${imp.percentualeAssociazioneAnno1}% per Relazione "${imp.tipoRelazioneAnno1}". Il valore dovrebbe essere ${guideline}.`);
    }
    if (imp.percentualeAssociazioneAnno2 && !validatePercentualeAssociazione(imp.tipoRelazioneAnno2, imp.percentualeAssociazioneAnno2)) {
      const guideline = imp.tipoRelazioneAnno2.includes("collegata")
        ? "minimo 50%"
        : "compreso tra 25% e 50%";
      msgs.push(`Impresa ${idx + 1} (Anno 2): % di Associazione è ${imp.percentualeAssociazioneAnno2}% per Relazione "${imp.tipoRelazioneAnno2}". Il valore dovrebbe essere ${guideline}.`);
    }
    return msgs;
  }, []);

  const numericErrors = [];
  const richFields = [
    { field: "fatturatoAnno1", label: "Fatturato Anno 1", min: 0 },
    { field: "attivoAnno1", label: "Attivo Anno 1", min: 0 },
    { field: "occupatiAnno1", label: "Occupati Anno 1", min: 0 },
    { field: "fatturatoAnno2", label: "Fatturato Anno 2", min: 0 },
    { field: "attivoAnno2", label: "Attivo Anno 2", min: 0 },
    { field: "occupatiAnno2", label: "Occupati Anno 2", min: 0 }
  ];
  richFields.forEach(({ field, label, min }) => {
    const val = Number(richiedente[field]);
    if (!isNaN(val) && val < min) {
      numericErrors.push(`Richiedente: ${label} deve essere almeno ${min}`);
    }
  });
  
  // Controllo per cada impresa
  imprese.forEach((imp, idx) => {
    const prefix = `Impresa ${idx + 1}`;
    const impFields = [
      { field: "fatturatoAnno1", label: "Fatturato Anno 1", min: 0 },
      { field: "attivoAnno1", label: "Attivo Anno 1", min: 0 },
      { field: "occupatiAnno1", label: "Occupati Anno 1", min: 0 },
      { field: "fatturatoAnno2", label: "Fatturato Anno 2", min: 0 },
      { field: "attivoAnno2", label: "Attivo Anno 2", min: 0 },
      { field: "occupatiAnno2", label: "Occupati Anno 2", min: 0 },
      { field: "percentualeAssociazioneAnno1", label: "% Associazione Anno 1", min: 0, max: 100 },
      { field: "percentualeAssociazioneAnno2", label: "% Associazione Anno 2", min: 0, max: 100 }
    ];
    impFields.forEach(({ field, label, min, max }) => {
      const val = Number(imp[field]);
      if (!isNaN(val)) {
        if (val < min) {
          numericErrors.push(`${prefix}: ${label} deve essere almeno ${min}`);
        }
        if (max !== undefined && val > max) {
          numericErrors.push(`${prefix}: ${label} deve essere al massimo ${max}`);
        }
      }
    });
  });
  
  return (
    <div className={`calcolo-dimensione-aziendale option-grid`}>
      {/* Etiqueta principal */}
      <div className="option-grid__label">{HtmlRenderer(mainLabel)}</div>

      <div className={`cda-grid-container ${showWarning ? " option-grid--pending-action" : ""}`}>
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
              Fatturato * %
            </div>
            <div className="option-grid__column-title cda-column-width-calc">
              Attivo * %
            </div>
            <div className="option-grid__column-title cda-column-width-calc">
              Occupati * %
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
                    Eliminare azienda
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

      {showWarning && (
        <div className="option-grid__warning">
          <FontAwesomeIcon icon={faExclamationCircle} />
          <span>Completa i campi obbligatori per l'anno {richiedente.anno1}</span>
        </div>
      )}

      {percentFeedbackMessages.length > 0 && (
        <div className="option-grid__warning">
          <div className="percentFeedbackMessages">
            {percentFeedbackMessages.map((msg, idx) => (
              <p key={idx}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                {msg}</p>
            ))}
          </div>
        </div>
      )}

      {numericErrors.length > 0 && (
        <div className="option-grid__warning">
          <div className="percentFeedbackMessages">
            {numericErrors.map((msg, idx) => (
              <p key={idx}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                {msg}
              </p>
            ))}
          </div>
        </div>
      )}

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
