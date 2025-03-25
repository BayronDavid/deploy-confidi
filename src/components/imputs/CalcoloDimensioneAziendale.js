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
    // Los años se mostrarán pero no serán editables
    anno1: "2022",
    anno2: "2023",
    fatturatoAnno1: "",
    fatturatoAnno2: "",
    attivoAnno1: "",
    attivoAnno2: "",
    occupatiAnno1: "",
    occupatiAnno2: "",
    tipoRelazione: "richiedente", // Por defecto, "richiedente"
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
      // Si quieres almacenar ya los % calculados, se podría.
      // De momento, los calcularemos en base a la lógica que prefieras.
    }))
  );

  // Handlers para cambios
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

  /**
   * Aquí podrías hacer los cálculos de % (Imp./Gr.Rel.)
   * en función de la relación (associata/collegata) y
   * el % di associazione de cada año.
   * Para simplificar, se muestra la estructura y la UI,
   * pero la lógica de cálculo la implementas según tus reglas.
   */
  const calculatePercentages = () => {
    // Ejemplo básico: no hace cálculos, solo retorna 0
    // Recorre cada impresa (incluyendo la principal) y
    // añade la propiedad fatturatoPercAnno1, etc.
    // Si prefieres, podrías modificar el estado. O bien
    // devolver algo a mostrar en el render.
    return {
      richiedente: {
        fatturatoPercAnno1: "Auto",
        fatturatoPercAnno2: "Auto",
        attivoPercAnno1: "Auto",
        attivoPercAnno2: "Auto",
        occupatiPercAnno1: "Auto",
        occupatiPercAnno2: "Auto",
      },
      imprese: imprese.map((imp) => ({
        id: imp.id,
        fatturatoPercAnno1: "Auto",
        fatturatoPercAnno2: "Auto",
        attivoPercAnno1: "Auto",
        attivoPercAnno2: "Auto",
        occupatiPercAnno1: "Auto",
        occupatiPercAnno2: "Auto",
      })),
    };
  };

  // Ejemplo: generamos un diccionario con los % calculados
  const autoValues = calculatePercentages();

  /**
   * Renderizar CABECERA de la tabla (10 columnas).
   * Orden exacto:
   * 1) Denominazione e C.F. Impresa
   * 2) Anno di Riferimento
   * 3) Fatturato
   * 4) Attivo
   * 5) Occupati (ULA)
   * 6) Relazione & Collegamento
   * 7) % di Associazione
   * 8) Fatturato % (Imp./Gr.Rel.)
   * 9) Attivo % (Imp./Gr.Rel.)
   * 10) Occupati % (Imp./Gr.Rel.)
   */
  const renderTableHeader = () => (
    <div className="option-grid__column-titles cda-header-row">
      <div className="option-grid__column-title" style={{ flex: "0 0 200px" }}>
        Denominazione e C.F. Impresa
      </div>
      <div className="option-grid__column-title" style={{ flex: "0 0 100px" }}>
        Anno di Riferimento
      </div>
      <div className="option-grid__column-title">Fatturato</div>
      <div className="option-grid__column-title">Attivo</div>
      <div className="option-grid__column-title">Occupati (ULA)</div>
      <div className="option-grid__column-title" style={{ flex: "0 0 180px" }}>
        Relazione & Collegamento
      </div>
      <div className="option-grid__column-title">% di Associazione</div>
      <div className="option-grid__column-title">Fatturato % (Imp./Gr.Rel.)</div>
      <div className="option-grid__column-title">Attivo % (Imp./Gr.Rel.)</div>
      <div className="option-grid__column-title">Occupati % (Imp./Gr.Rel.)</div>
    </div>
  );

  /**
   * Renderiza 2 sub-filas para cada empresa:
   *  - sub-fila 1 => Año 1
   *  - sub-fila 2 => Año 2
   * Con rowSpan para la 1a columna (Denominazione) y la 6a (Relazione).
   * Este esquema reproduce la estética de la tabla en tu captura.
   */
  const renderEnterpriseRow = (company, autoData, isMain = false) => {
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

    // Datos automáticos (cálculos) para esta empresa (o richiedente)
    const dataAuto = autoData || {};

    // sub-fila 1 (Año 1)
    const row1 = (
      <div className="option-grid__row cda-body-row">
        {/* 1) Denominazione e C.F. Impresa (rowSpan=2) */}
        <div
          className="option-grid__column cda-cell--span2"
          style={{ flex: "0 0 200px" }}
          rowSpan={2}
        >
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

        {/* 2) Anno di Riferimento => "Anno 1" (read-only) */}
        <div className="option-grid__column" style={{ flex: "0 0 100px" }}>
          <div className="option-grid__input-pill">
            <span>{`Anno ${anno1}`}</span>
          </div>
        </div>

        {/* 3) Fatturato (Año 1) */}
        <div className="option-grid__column">
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

        {/* 4) Attivo (Año 1) */}
        <div className="option-grid__column">
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

        {/* 5) Occupati (Año 1) */}
        <div className="option-grid__column">
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

        {/* 6) Relazione & Collegamento (rowSpan=2) */}
        <div
          className="option-grid__column cda-cell--span2"
          style={{ flex: "0 0 180px" }}
          rowSpan={2}
        >
          <div className="option-grid__input-pill">
            {tipoRelazione === "richiedente" ? (
              <CustomSelector
                label="Relazione"
                options={[{ value: "richiedente", label: "Richiedente" }]}
                value="richiedente"
                disabled
                width="180px"
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
                required
                width="180px"
                floatingOptions
              />
            )}
          </div>
        </div>

        {/* 7) % di Associazione (Año 1) */}
        <div className="option-grid__column">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="% A1"
              value={percentualeAssociazioneAnno1}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("percentualeAssociazioneAnno1", e.target.value)
                  : handleChangeImpresa(company.id, "percentualeAssociazioneAnno1", e.target.value)
              }
            />
          </div>
        </div>

        {/* 8) Fatturato % (Imp./Gr.Rel.) (Año 1) => valor automático */}
        <div className="option-grid__column">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={dataAuto?.fatturatoPercAnno1 || "Auto"}
            />
          </div>
        </div>

        {/* 9) Attivo % (Imp./Gr.Rel.) (Año 1) => valor automático */}
        <div className="option-grid__column">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={dataAuto?.attivoPercAnno1 || "Auto"}
            />
          </div>
        </div>

        {/* 10) Occupati % (Imp./Gr.Rel.) (Año 1) => valor automático */}
        <div className="option-grid__column">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={dataAuto?.occupatiPercAnno1 || "Auto"}
            />
          </div>
        </div>
      </div>
    );

    // sub-fila 2 (Año 2)
    const row2 = (
      <div className="option-grid__row cda-body-row">
        {/* [1) Denominazione e C.F. Impresa] => ya está con rowSpan en row1 */}
        {/* 2) Anno di Riferimento => "Anno 2" */}
        <div className="option-grid__column" style={{ flex: "0 0 100px" }}>
          <div className="option-grid__input-pill">
            <span>{`Anno ${anno2}`}</span>
          </div>
        </div>

        {/* 3) Fatturato (Año 2) */}
        <div className="option-grid__column">
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

        {/* 4) Attivo (Año 2) */}
        <div className="option-grid__column">
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

        {/* 5) Occupati (Año 2) */}
        <div className="option-grid__column">
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

        {/* [6) Relazione & Collegamento] => rowSpan en row1 */}
        {/* 7) % di Associazione (Año 2) */}
        <div className="option-grid__column">
          <div className="option-grid__input-pill">
            <input
              type="number"
              placeholder="% A2"
              value={percentualeAssociazioneAnno2}
              onChange={(e) =>
                isMain
                  ? handleChangeRichiedente("percentualeAssociazioneAnno2", e.target.value)
                  : handleChangeImpresa(company.id, "percentualeAssociazioneAnno2", e.target.value)
              }
            />
          </div>
        </div>

        {/* 8) Fatturato % (Imp./Gr.Rel.) (Año 2) => valor automático */}
        <div className="option-grid__column">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={dataAuto?.fatturatoPercAnno2 || "Auto"}
            />
          </div>
        </div>

        {/* 9) Attivo % (Imp./Gr.Rel.) (Año 2) => valor automático */}
        <div className="option-grid__column">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={dataAuto?.attivoPercAnno2 || "Auto"}
            />
          </div>
        </div>

        {/* 10) Occupati % (Imp./Gr.Rel.) (Año 2) => valor automático */}
        <div className="option-grid__column">
          <div className="option-grid__input-pill">
            <input
              type="text"
              readOnly
              value={dataAuto?.occupatiPercAnno2 || "Auto"}
            />
          </div>
        </div>
      </div>
    );

    return (
      <>
        {row1}
        {row2}
      </>
    );
  };

  /**
   * Renderizar el bloque de "Totali" (si lo necesitas).
   * Aquí podrías sumar los valores de Anno1 y Anno2 de
   * Fatturato, Attivo, Occupati, etc.
   * En el ejemplo, se deja una estructura mínima.
   */
  const renderTotals = () => {
    // Ejemplo mínimo, sin lógica real
    return (
      <div className="cda-totali">
        <h3 className="cda-title">Totali</h3>
        <div className="option-grid">
          <div className="option-grid__column-titles">
            <div className="option-grid__column-title">Anno</div>
            <div className="option-grid__column-title">Fatturato</div>
            <div className="option-grid__column-title">Attivo</div>
            <div className="option-grid__column-title">Occupati</div>
          </div>
          <div className="option-grid__list">
            <div className="option-grid__row">
              <div className="option-grid__column">
                <div className="option-grid__input-pill">
                  <span>Anno {richiedente.anno1}</span>
                </div>
              </div>
              <div className="option-grid__column">
                <div className="option-grid__input-pill">
                  <span>0 €</span>
                </div>
              </div>
              <div className="option-grid__column">
                <div className="option-grid__input-pill">
                  <span>0 €</span>
                </div>
              </div>
              <div className="option-grid__column">
                <div className="option-grid__input-pill">
                  <span>0</span>
                </div>
              </div>
            </div>
            <div className="option-grid__row">
              <div className="option-grid__column">
                <div className="option-grid__input-pill">
                  <span>Anno {richiedente.anno2}</span>
                </div>
              </div>
              <div className="option-grid__column">
                <div className="option-grid__input-pill">
                  <span>0 €</span>
                </div>
              </div>
              <div className="option-grid__column">
                <div className="option-grid__input-pill">
                  <span>0 €</span>
                </div>
              </div>
              <div className="option-grid__column">
                <div className="option-grid__input-pill">
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render principal
   */
  return (
    <div className="calcolo-dimensione-aziendale">
      {/* Etiqueta principal */}
      <div className="option-grid__label">{HtmlRenderer(mainLabel)}</div>

      {/* Cabecera */}
      {renderTableHeader()}

      {/* Contenedor de filas */}
      <div className="option-grid__list">
        {/* Impresa Richiedente (siempre en primer lugar) */}
        {renderEnterpriseRow(
          richiedente,
          autoValues.richiedente,
          /* isMain = */ true
        )}

        {/* Empresas opcionales */}
        {imprese.map((imp, idx) => {
          // Buscar datos automáticos para esta impresa
          const foundAuto = autoValues.imprese.find((x) => x.id === imp.id) || {};
          return (
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
              {renderEnterpriseRow(imp, foundAuto, false)}
            </div>
          );
        })}
      </div>

      {/* Botón para agregar nueva empresa */}
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

      {/* Sección de Totales (opcional) */}
      {renderTotals()}
    </div>
  );
}
