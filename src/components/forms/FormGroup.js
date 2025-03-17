// /components/FormGroup.js
"use client";
import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import { useFormsContext } from "@/context/FormsContext";
import "./FormGroup.css";

function FormGroup({ group, groupData }) {
  const { updateFormData, setIsCurrentFormValid } = useFormsContext();
  const [localData, setLocalData] = useState(groupData || {});
  
  // Verificar si el grupo está habilitado, por defecto es true
  const isGroupEnabled = group.enabled !== false;

  useEffect(() => {
    setLocalData(groupData || {});
  }, [groupData]);

  // Validación interna del grupo usando un array seguro
  useEffect(() => {
    let isValid = true;
    (group.inputs || []).forEach((input) => {
      // Solo validar los inputs requeridos si el grupo está habilitado
      if (isGroupEnabled && input.required && input.enabled !== false) {
        // Validación específica por tipo
        if (input.type === "documentRequest") {
          const value = localData[input.id];
          // Validación específica para documentRequest
          if (!(input.isOptional && value === "skipped") && 
              !(value instanceof File || (value && typeof value === 'object' && value.__isFile))) {
            isValid = false;
          }
        } else if (input.type === "optionSelector") {
          const value = localData[input.id];
          if (!Array.isArray(value) || value.length === 0) {
            isValid = false;
          }
        } else if (!localData[input.id] || localData[input.id] === "") {
          isValid = false;
        }
      }
    });
    
    // Disparar una actualización en el contexto para forzar re-validación
    if (!isValid) {
      setIsCurrentFormValid(false);
    }
  }, [localData, group.inputs, isGroupEnabled]);

  const handleInputChange = (inputId, value) => {
    // Solo procesar cambios si el grupo está habilitado
    if (isGroupEnabled) {
      const updatedData = { ...localData, [inputId]: value };
      setLocalData(updatedData);
      updateFormData(group.id, updatedData);
    }
  };

  // Si el grupo está deshabilitado, podríamos no renderizarlo o mostrarlo con estilo diferente
  if (!isGroupEnabled) {
    return null; // O podrías mostrar un mensaje de que el grupo está deshabilitado
  }

  return (
    <div className="form-group-container">
      {/* Solo mostrar título y descripción si existen */}
      {group.title && <h2>{group.title}</h2>}
      {group.description && <p>{group.description}</p>}
      
      <div className={`form-group__form-input ${group.isColumn ? 'form-group__form-input--column' : ''}`}>
        {(group.inputs || []).map((input) => (
          <FormInput
            key={input.id}
            config={{ ...input, enabled: input.enabled !== false && isGroupEnabled }}
            value={localData[input.id]}
            onChange={(value) => handleInputChange(input.id, value)}
          />
        ))}
      </div>
      
    </div>
  );
}

export default FormGroup;
