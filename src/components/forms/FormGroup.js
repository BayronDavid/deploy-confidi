"use client";
import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import { useFormsContext } from "@/context/FormsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./FormGroup.css";
import HtmlRenderer from "@/utils/HtmlRenderer";

function FormGroup({ 
  group, 
  groupData, 
  isInAccordion = false,
  parentGroupId = null,
  isRepeatable = false,
  instanceIndex = 0,
  canDelete = false,
  ...restProps 
}) {
  const { 
    updateFormData, 
    setIsCurrentFormValid, 
    deleteGroupInstance 
  } = useFormsContext();
  
  const [localData, setLocalData] = useState(groupData || {});
  
  // Verificar si el grupo está habilitado, por defecto es true
  const isGroupEnabled = group.enabled !== false;

  // Use the group config for repeatability if defined, otherwise use prop
  const repeatableGroup = group.repeatable !== undefined ? group.repeatable : isRepeatable;

  // generar clases de layout basadas en la configuración
  const getLayoutClasses = (layoutConfig = null) => {
    // Usar el layout proporcionado o el del grupo
    const layout = layoutConfig || group.layout;
    
    // Si tiene configuración de layout avanzada
    if (layout) {
      const { 
        columns = 1, 
        gap = 'normal', 
        alignment = 'stretch', 
        responsive = {} 
      } = layout;
      
      let classes = [];
      
      // Clase base para número de columnas (asegurarse de que es válida)
      const validColumns = [1, 2, 3, 4].includes(columns) ? columns : 1;
      classes.push(`form-group__grid-cols-${validColumns}`);
      
      // Clases para espaciado
      const validGap = ['small', 'normal', 'large'].includes(gap) ? gap : 'normal';
      classes.push(`form-group__gap-${validGap}`);
      
      // Clases para alineación
      const validAlignment = ['start', 'center', 'end', 'stretch'].includes(alignment) ? alignment : 'stretch';
      classes.push(`form-group__align-${validAlignment}`);
      
      // Configuraciones responsivas mejoradas
      if (responsive.large && [1, 2, 3].includes(responsive.large)) {
        classes.push(`form-group__large-cols-${responsive.large}`);
      }
      
      if (responsive.tablet && [1, 2, 3].includes(responsive.tablet)) {
        classes.push(`form-group__tablet-cols-${responsive.tablet}`);
      }
      
      if (responsive.smallTablet && [1, 2].includes(responsive.smallTablet)) {
        classes.push(`form-group__small-tablet-cols-${responsive.smallTablet}`);
      }
      
      if (responsive.mobile && [1, 2].includes(responsive.mobile)) {
        classes.push(`form-group__mobile-cols-${responsive.mobile}`);
      }
      
      return classes.join(' ');
    }
    
    // Aplicar layout por defecto seguro para móviles
    return 'form-group__grid-cols-1 form-group__gap-normal form-group__align-stretch';
  };

  useEffect(() => {
    setLocalData(groupData || {});
  }, [groupData]);

  // Validación interna del grupo
  useEffect(() => {
    let isValid = true;
    
    // Validar subgrupos si existen
    if (group.subGroups) {
      for (const subGroup of group.subGroups) {
        // Solo validar si está habilitado
        if (subGroup.enabled !== false && isGroupEnabled) {
          const subGroupData = localData[subGroup.id] || {};
          
          for (const input of subGroup.inputs || []) {
            if (input.required && input.enabled !== false) {
              // Validación similar a la ya existente para inputs
              if (input.type === "documentRequest") {
                const value = subGroupData[input.id];
                if (!(input.isOptional && value === "skipped") && 
                    !(value instanceof File || (value && typeof value === 'object' && value.__isFile))) {
                  isValid = false;
                }
              } else if (input.type === "optionSelector") {
                const value = subGroupData[input.id];
                if (!Array.isArray(value) || value.length === 0) {
                  isValid = false;
                }
              } else if (!subGroupData[input.id] || subGroupData[input.id] === "") {
                isValid = false;
              }
            }
          }
        }
      }
    } else {
      // Validación original para los inputs
      (group.inputs || []).forEach((input) => {
        if (isGroupEnabled && input.required && input.enabled !== false) {
          if (input.type === "documentRequest") {
            const value = localData[input.id];
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
    }
    
    // Disparar una actualización en el contexto para forzar re-validación
    if (!isValid) {
      setIsCurrentFormValid(false);
    }
  }, [localData, group, isGroupEnabled]);

  const handleInputChange = (inputId, value, subGroupId = null) => {
    // Solo procesar cambios si el grupo está habilitado
    if (!isGroupEnabled) return;
    
    let updatedData;
    
    // Si hay un subgrupo, actualizar dentro de ese subgrupo
    if (subGroupId) {
      updatedData = { 
        ...localData, 
        [subGroupId]: { 
          ...(localData[subGroupId] || {}), 
          [inputId]: value 
        } 
      };
    } else {
      updatedData = { ...localData, [inputId]: value };
    }
    
    setLocalData(updatedData);
    
    // Actualizar datos en el contexto
    if (parentGroupId) {
      // Si esto es un subgrupo de otro grupo
      updateFormData(parentGroupId, { ...groupData, [group.id]: updatedData });
    } else if (isRepeatable) {
      // Si esto es una instancia de un grupo repetible
      updateFormData(group.id, updatedData, instanceIndex);
    } else {
      // Caso normal
      updateFormData(group.id, updatedData);
    }
  };

  // Si el grupo está deshabilitado, no lo renderizamos
  if (!isGroupEnabled) {
    return null;
  }

  // Manejar la eliminación de una instancia repetible - implementación mejorada
  const handleDeleteInstance = () => {
    console.log("Eliminando instancia:", group.id, instanceIndex);
    deleteGroupInstance(group.id, instanceIndex);
  };

  // botón de eliminar extraído para mayor claridad
  const DeleteButton = () => {
    if (!repeatableGroup || !canDelete) {
      return null;
    }
    
    return (
      <button 
        type="button" 
        className="delete-instance-btn"
        onClick={handleDeleteInstance}
      >
        <FontAwesomeIcon icon={faTrash} /> 
      </button>
    );
  };

  return (
    <div 
      className={`form-group-container ${repeatableGroup ? 'repeatable-instance' : ''}`}
      {...restProps} // Propagar atributos adicionales como data-group-id
    >
      {/* Always show title if exists */}
      {group.title && (
        <div className="group-header">
          <h2>{group.title}</h2>
          {repeatableGroup && <DeleteButton />}
        </div>
      )}
      
      {/* Si solo hay botón de eliminar sin título */}
      {!group.title && repeatableGroup && canDelete && (
        <div className="group-header group-header--delete-only">
          <DeleteButton />
        </div>
      )}
      
      {group.description && <p>{HtmlRenderer(group.description)}</p>}
      
      {/* Renderizar subgrupos si existen */}
      {group.subGroups ? (
        <div className="sub-groups-container">
          {group.subGroups.map(subGroup => (
            <div key={subGroup.id} className="sub-group">
              {subGroup.title && <h3>{subGroup.title}</h3>}
              {subGroup.description && <p>{HtmlRenderer(subGroup.description)}</p>}
              
              <div className={`form-group__form-input ${getLayoutClasses(subGroup.layout)}`}>
                {(subGroup.inputs || []).map((input, index) => (
                  <FormInput
                    key={`${input.id}-${index}`}
                    config={{ ...input, enabled: input.enabled !== false && isGroupEnabled }}
                    value={
                      input.type === "DynamicInputGrid"
                        ? ((localData[subGroup.id] || {})[input.id] ?? { selectedValues: [], optionsData: input.options || [] })
                        : (localData[subGroup.id] || {})[input.id]
                    }
                    onChange={(value) => handleInputChange(input.id, value, subGroup.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`form-group__form-input ${getLayoutClasses()}`}>
          {(group.inputs || []).map((input, index) => (
            <FormInput
              key={`${input.id}-${index}`}
              config={{ ...input, enabled: input.enabled !== false && isGroupEnabled }}
              value={
                input.type === "DynamicInputGrid"
                  ? (localData[input.id] ?? { selectedValues: [], optionsData: input.options || [] })
                  : localData[input.id]
              }
              onChange={(value) => handleInputChange(input.id, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FormGroup;
