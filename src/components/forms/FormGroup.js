// /components/FormGroup.js
"use client";
import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import { useFormsContext } from "@/context/FormsContext";

function FormGroup({ group, groupData }) {
  const { updateFormData } = useFormsContext();
  const [localData, setLocalData] = useState(groupData || {});

  useEffect(() => {
    setLocalData(groupData || {});
  }, [groupData]);

  // Validación interna del grupo usando un array seguro
  useEffect(() => {
    let isValid = true;
    (group.inputs || []).forEach((input) => {
      if (input.required && (!localData[input.id] || localData[input.id] === "")) {
        isValid = false;
      }
    });
    // Aquí podrías actualizar un estado de validez si es necesario
  }, [localData, group.inputs]);

  const handleInputChange = (inputId, value) => {
    const updatedData = { ...localData, [inputId]: value };
    setLocalData(updatedData);
    updateFormData(group.id, updatedData);
  };

  return (
    <div style={{ margin: "1rem 0", border: "1px solid #ccc", padding: "1rem" }}>
      <h2>{group.title}</h2>
      {group.description && <p>{group.description}</p>}
      {(group.inputs || []).map((input) => (
        <FormInput
          key={input.id}
          config={input}
          value={localData[input.id]}
          onChange={(value) => handleInputChange(input.id, value)}
        />
      ))}
    </div>
  );
}

export default FormGroup;
