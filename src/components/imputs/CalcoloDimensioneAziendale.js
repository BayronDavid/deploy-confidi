"use client";
import React, { useState, useEffect } from "react";
import "./DynamicInputGrid.css";
import "./CalcoloDimensioneAziendale.css";
import HtmlRenderer from "@/utils/HtmlRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import CustomSelector from "./CustomSelector";
import { useFormsContext } from "@/context/FormsContext";

// Función mejorada para validar % di Associazione según tipo específico di relazione
const validatePercentualeAssociazione = (relation, value) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  
  // Relaciones que requieren 100% (o >= 50% si se permite edición)
  if (relation === "collegata" || 
      relation === "collegata_persona_fisica" || 
      relation === "collegata_di_collegata") {
    return num >= 50;
  }
  
  // Relaciones que requieren entre 25% y 50%
  if (relation === "associata" || 
      relation === "associata_di_collegata" || 
      relation === "collegata_di_associata") {
    return num >= 25 && num < 50;
  }
  
  // Para "richiedente" siempre 100%, pero no debe validarse aquí
  if (relation === "richiedente") {
    return num === 100;
  }
  
  // Por defecto, si no reconocemos la relación
  return false;
};

// Helper para determinar si una relación debe estar fijada al 100%
const shouldBeLockedAt100Percent = (relation) => {
  return relation === "richiedente" || 
         relation === "collegata" || 
         relation === "collegata_persona_fisica" || 
         relation === "collegata_di_collegata";
};

// Helper para obtener el rango permitido según relación
const getPercentageRangeByRelation = (relation) => {
  if (shouldBeLockedAt100Percent(relation)) {
    return "100%";
  }
  return "da 25% a <50%";
};

export default function CalcoloDimensioneAziendale({
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
  initialImprese = [],
  mainLabel = "Impresa Richiedente",
  addButtonLabel = "Aggiungi Impresa Collegata o associata",
  onChange,
  value,
}) {
  const tipoRelazioneOptions = [
    { value: "richiedente", label: "Richiedente" },
    { value: "associata", label: "Associata" },
    { value: "collegata", label: "Collegata" },
    { value: "associata_di_collegata", label: "Associata di Collegata" },
    { value: "collegata_di_associata", label: "Collegata di Associata" },
    { value: "collegata_di_collegata", label: "Collegata di Collegata" },
    { value: "collegata_persona_fisica", label: "Collegata Persona Fisica" },
  ];

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

  const [inputErrors, setInputErrors] = useState({});

  useEffect(() => {
    if (value && typeof value === 'object') {
      if (value.richiedente) {
        setRichiedente(prevRichiedente => ({
          ...prevRichiedente,
          ...value.richiedente
        }));
      }

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
  }, []);

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
      const formattedData = {
        richiedente: mainData,
        imprese: impreseData,
        impresaRichiedente: {
          denominazione: mainData.denominazioneCf || ""
        }
      };
      onChange(formattedData);
    }
  };

  const calculateTotals = () => {
    let totals = {
      fatturatoAnno1: 0,
      fatturatoAnno2: 0,
      attivoAnno1: 0,
      attivoAnno2: 0,
      occupatiAnno1: 0,
      occupatiAnno2: 0,
    };

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

    imprese.forEach((imp) => {
      const relationA1 = imp.tipoRelazioneAnno1;
      const relationA2 = imp.tipoRelazioneAnno2;
      
      const pA1 = shouldBeLockedAt100Percent(relationA1) 
        ? 100 
        : (imp.percentualeAssociazioneAnno1 ? Number(imp.percentualeAssociazioneAnno1) : 0);
      
      const pA2 = shouldBeLockedAt100Percent(relationA2) 
        ? 100 
        : (imp.percentualeAssociazioneAnno2 ? Number(imp.percentualeAssociazioneAnno2) : 0);

      if (imp.fatturatoAnno1) {
        totals.fatturatoAnno1 += (Number(imp.fatturatoAnno1) * pA1) / 100;
      }
      if (imp.fatturatoAnno2) {
        totals.fatturatoAnno2 += (Number(imp.fatturatoAnno2) * pA2) / 100;
      }

      if (imp.attivoAnno1) {
        totals.attivoAnno1 += (Number(imp.attivoAnno1) * pA1) / 100;
      }
      if (imp.attivoAnno2) {
        totals.attivoAnno2 += (Number(imp.attivoAnno2) * pA2) / 100;
      }

      if (imp.occupatiAnno1) {
        totals.occupatiAnno1 += (Number(imp.occupatiAnno1) * pA1) / 100;
      }
      if (imp.occupatiAnno2) {
        totals.occupatiAnno2 += (Number(imp.occupatiAnno2) * pA2) / 100;
      }
    });

    return totals;
  };

  const groupTotals = calculateTotals();

  const getEnterprisePartialValue = (company, field, year, isMain) => {
    if (isMain) {
      return Number(company[field]) || 0;
    }
    
    const relation = year === 1 ? company.tipoRelazioneAnno1 : company.tipoRelazioneAnno2;
    
    let percentage;
    if (shouldBeLockedAt100Percent(relation)) {
      percentage = 100;
    } else {
      percentage = year === 1 
        ? Number(company.percentualeAssociazioneAnno1) || 0 
        : Number(company.percentualeAssociazioneAnno2) || 0;
    }
    
    const val = Number(company[field]) || 0;
    return (val * percentage) / 100;
  };

  const getPercentageOfGroup = (partialValue, total) => {
    if (!total || total === 0) return 0;
    return (partialValue / total) * 100;
  };

  const today = new Date();
  const referenceYear = (today.getMonth() === 0 && today.getDate() === 1)
    ? today.getFullYear()
    : today.getFullYear() - 1;
  const annoOptions = [referenceYear.toString(), (referenceYear - 1).toString()];

  const handleChangeAnno = (newAnno1) => {
    const newAnno1Number = Number(newAnno1);
    const updated = {
      ...richiedente,
      anno1: newAnno1.toString(),
      anno2: (newAnno1Number - 1).toString()
    };
    setRichiedente(updated);
    notifyChange(updated, imprese);
  };

  const { formSubmitAttempted } = useFormsContext();

  const isFieldMissing = (val) => formSubmitAttempted && (!val || val.toString().trim() === "");

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

  const renderCompanyRows = (company, isMain = false) => {
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

    const isLockedA1 = isMain || shouldBeLockedAt100Percent(tipoRelazioneAnno1);
    const isLockedA2 = isMain || shouldBeLockedAt100Percent(tipoRelazioneAnno2);

    const percentValid = isMain ? true : validatePercentualeAssociazione(tipoRelazioneAnno1, percentualeAssociazioneAnno1);
    const percentValidA2 = isMain ? true : (percentualeAssociazioneAnno2 ? validatePercentualeAssociazione(tipoRelazioneAnno2, percentualeAssociazioneAnno2) : true);

    const prefix = isMain ? "richiedente" : company.id;

    const rowAnno1 = (
      <div className="option-grid__row">
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

        <div className="option-grid__column cda-column-width-percentuale">
          <div className={`option-grid__input-pill ${!percentValid ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              name={`${prefix}_percentualeAssociazioneAnno1`}
              placeholder="% A1"
              value={isLockedA1 ? "100" : percentualeAssociazioneAnno1}
              onChange={(e) =>
                isLockedA1
                  ? null
                  : handleChangeImpresa(
                    company.id,
                    "percentualeAssociazioneAnno1",
                    e.target.value
                  )
              }
              readOnly={isLockedA1}
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => isLockedA1 ? null : handleBlur(e, 0, 100)}
              min="0"
              max="100"
            />
          </div>
        </div>

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

    const rowAnno2 = (
      <div className="option-grid__row">
        <div className="option-grid__column cda-column-width-denominazione"></div>

        <div className="option-grid__column cda-column-width-anno">
          <div className="option-grid__input-pill">
            {isMain ? (
              <span>{richiedente.anno2}</span>
            ) : (
              <span>{richiedente.anno2}</span>
            )}
          </div>
        </div>

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

        <div className="option-grid__column cda-column-width-percentuale">
          <div className={`option-grid__input-pill ${!percentValidA2 ? "option-grid__input-pill--error" : ""}`}>
            <input
              type="number"
              name={`${prefix}_percentualeAssociazioneAnno2`}
              placeholder="% A2"
              value={isLockedA2 ? "100" : percentualeAssociazioneAnno2}
              onChange={(e) =>
                isLockedA2
                  ? null
                  : handleChangeImpresa(
                    company.id,
                    "percentualeAssociazioneAnno2",
                    e.target.value
                  )
              }
              readOnly={isLockedA2}
              onWheelCapture={(e) => e.preventDefault()}
              onBlur={(e) => isLockedA2 ? null : handleBlur(e, 0, 100)}
              min="0"
              max="100"
            />
          </div>
        </div>

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

  const isMissingMandatory = (company) =>
    !company.denominazioneCf ||
    !company.fatturatoAnno1 ||
    !company.attivoAnno1 ||
    !company.occupatiAnno1;

  const missingRequired = isMissingMandatory(richiedente) || imprese.some(imp => isMissingMandatory(imp));
  const showWarning = formSubmitAttempted && missingRequired;

  const percentFeedbackMessages = imprese.reduce((msgs, imp, idx) => {
    if (!validatePercentualeAssociazione(imp.tipoRelazioneAnno1, imp.percentualeAssociazioneAnno1)) {
      const rangeMessage = getPercentageRangeByRelation(imp.tipoRelazioneAnno1);
      msgs.push(`Impresa ${idx + 1} (Anno 1): % di Associazione è ${imp.percentualeAssociazioneAnno1}% per Relazione "${imp.tipoRelazioneAnno1}". Il valore dovrebbe essere ${rangeMessage}.`);
    }
    if (imp.percentualeAssociazioneAnno2 && !validatePercentualeAssociazione(imp.tipoRelazioneAnno2, imp.percentualeAssociazioneAnno2)) {
      const rangeMessage = getPercentageRangeByRelation(imp.tipoRelazioneAnno2);
      msgs.push(`Impresa ${idx + 1} (Anno 2): % di Associazione è ${imp.percentualeAssociazioneAnno2}% per Relazione "${imp.tipoRelazioneAnno2}". Il valore dovrebbe essere ${rangeMessage}.`);
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
      <div className="option-grid__label">{HtmlRenderer(mainLabel)}</div>

      <div className={`cda-grid-container ${showWarning ? " option-grid--pending-action" : ""}`}>
        <div className="cda-grid-table">
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

          <div className="cda-grid-body">
            <div className="option-grid__list">
              {renderCompanyRows(richiedente, true)}
            </div>

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

            <div className="cda-impresa-optional cda-totali-section">
              <div className="option-grid__list">
                <div className="option-grid__row cda-totali-row">
                  <div className="option-grid__column cda-column-width-denominazione"></div>
                  <div className="option-grid__column cda-column-width-anno"></div>
                  <div className="option-grid__column cda-column-width-fatturato"></div>
                  <div className="option-grid__column cda-column-width-attivo"></div>
                  <div className="option-grid__column cda-column-width-occupati"></div>

                  <div className="option-grid__column cda-column-width-relazione">
                    <strong>Totale Anno {richiedente.anno1}</strong>
                  </div>

                  <div className="option-grid__column cda-column-width-percentuale">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.fatturatoAnno1.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.attivoAnno1.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.occupatiAnno1.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div className="option-grid__row cda-totali-row">
                  <div className="option-grid__column cda-column-width-denominazione"></div>
                  <div className="option-grid__column cda-column-width-anno"></div>
                  <div className="option-grid__column cda-column-width-fatturato"></div>
                  <div className="option-grid__column cda-column-width-attivo"></div>
                  <div className="option-grid__column cda-column-width-occupati"></div>

                  <div className="option-grid__column cda-column-width-relazione">
                    <strong>Totale Anno {richiedente.anno2}</strong>
                  </div>

                  <div className="option-grid__column cda-column-width-percentuale">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.fatturatoAnno2.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.attivoAnno2.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  <div className="option-grid__column cda-column-width-calc">
                    <div className="option-grid__input-pill">
                      <span>
                        {groupTotals.occupatiAnno2.toLocaleString()}
                      </span>
                    </div>
                  </div>

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

      <div className="option-grid__add-row">
        <button type="button" className="add-row-button" onClick={handleAddImpresa}>
          <FontAwesomeIcon icon={faPlus} />
          <span>{addButtonLabel}</span>
        </button>
      </div>
    </div>
  );
}
