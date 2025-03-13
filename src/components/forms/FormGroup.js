// /components/FormGroup.js
"use client";
import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import { useFormsContext } from "@/context/FormsContext";
import "./FormGroup.css";

function FormGroup({ group, groupData }) {
  const { updateFormData } = useFormsContext();
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
      if (isGroupEnabled && input.required && (!localData[input.id] || localData[input.id] === "")) {
        isValid = false;
      }
    });
    // Aquí podrías actualizar un estado de validez si es necesario
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
      
      <div className="form-group__form-input">
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
