"use client";
import React, { useEffect, useRef } from "react";
import { useFormsContext } from "@/context/FormsContext";
import FormGroup from "./FormGroup";
import useHasMounted from "@/hooks/useHasMounted";
import FormInput from "./FormInput";
import Accordion from "../Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

/**
 * Verifica si un valor es un archivo o lista de archivos válidos.
 */
function isValidFile(value) {
    if (!value) return false;

    // Caso: archivo único
    if (value instanceof File) return true;

    // Caso: array de archivos
    if (Array.isArray(value)) {
        return value.some(
            (item) =>
                item instanceof File ||
                (item && typeof item === "object" && item.__isFile)
        );
    }

    // Caso: objeto con marca de __isFile
    return value && typeof value === "object" && value.__isFile;
}

/**
 * Valida el valor de un "documentRequest".
 */
function validateDocumentRequest(value, isOptional) {
    if (isOptional && value === "skipped") {
        return true;
    }
    if (!isOptional && value === "skipped") {
        return false;
    }
    return isValidFile(value);
}

/**
 * Valida un input cualquiera según su tipo y configuración
 */
function validateInput(groupData, input) {
    if (input.enabled === false) return true;

    const value = groupData[input.id];

    if (input.type === "documentRequest") {
        return validateDocumentRequest(value, input.isOptional);
    } else if (input.type === "optionSelector") {
        if (input.required) {
            return Array.isArray(value) && value.length > 0;
        } else {
            return true;
        }
    } else {
        if (input.required) {
            return Boolean(value && value !== "");
        } else {
            return true;
        }
    }
}

/**
 * Valida un subgrupo completo según sus inputs
 */
function validateSubGroup(subGroupData, subGroup) {
    if (subGroup.enabled === false) return true;
    
    let isValid = true;
    for (const input of subGroup.inputs) {
        if (!validateInput(subGroupData || {}, input)) {
            isValid = false;
            break;
        }
    }
    
    return isValid;
}

function FormContainer({ formConfig }) {
    const hasMounted = useHasMounted();
    const initialValidationDone = useRef(false);
    const formRef = useRef(null);
    const {
        formData,
        updateFormData,
        setIsCurrentFormValid,
        setSubmitCurrentForm,
        setFormRef,
        duplicateGroup
    } = useFormsContext();

    // Al montar, forzamos inicialmente el formulario a "inválido" hasta que se complete la validación
    useEffect(() => {
        setIsCurrentFormValid(false);
        
        // Registrar la referencia del formulario en el contexto
        if (formRef.current) {
            setFormRef(formRef);
        }
    }, []);

    /**
     * Efecto: Validación inicial (solo una vez)
     */
    useEffect(() => {
        if (
            !formConfig ||
            !formConfig.groups ||
            !hasMounted ||
            initialValidationDone.current
        )
            return;

        let formIsValid = true;

        for (const group of formConfig.groups) {
            if (group.enabled === false) continue;

            // Grupo repetible
            if (group.repeatable) {
                const groupInstances = Array.isArray(formData[group.id]) 
                    ? formData[group.id] 
                    : (formData[group.id] ? [formData[group.id]] : []);
                
                // Un grupo repetible vacío no es válido si es requerido
                if (group.required && groupInstances.length === 0) {
                    formIsValid = false;
                    break;
                }
                
                // Validar cada instancia del grupo repetible
                for (const instance of groupInstances) {
                    // Si tiene subgrupos
                    if (group.subGroups) {
                        for (const subGroup of group.subGroups) {
                            if (!validateSubGroup(instance[subGroup.id], subGroup)) {
                                formIsValid = false;
                                break;
                            }
                        }
                    } 
                    // Si tiene inputs directos
                    else if (group.inputs) {
                        for (const input of group.inputs) {
                            if (!validateInput(instance, input)) {
                                formIsValid = false;
                                break;
                            }
                        }
                    }
                    
                    if (!formIsValid) break;
                }
            } 
            // Grupo normal con subgrupos
            else if (group.subGroups) {
                const groupData = formData[group.id] || {};
                
                for (const subGroup of group.subGroups) {
                    if (!validateSubGroup(groupData[subGroup.id], subGroup)) {
                        formIsValid = false;
                        break;
                    }
                }
            }
            // Grupo normal con inputs
            else if (group.inputs) {
                const groupData = formData[group.id] || {};
                for (const input of group.inputs) {
                    if (!validateInput(groupData, input)) {
                        formIsValid = false;
                        break;
                    }
                }
            } 
            // Input directo en el grupo
            else {
                if (!validateInput(formData, group)) {
                    formIsValid = false;
                }
            }

            if (!formIsValid) break;
        }

        setIsCurrentFormValid(formIsValid);
        initialValidationDone.current = true;
    }, [formConfig, formData, hasMounted, setIsCurrentFormValid]);

    /**
     * Efecto: Validación en cada cambio de formData o formConfig
     */
    useEffect(() => {
        if (!formConfig || !formConfig.groups) {
            setIsCurrentFormValid(false);
            return;
        }

        let formIsValid = true;

        for (const group of formConfig.groups) {
            if (group.enabled === false) continue;

            // Grupo repetible
            if (group.repeatable) {
                const groupInstances = Array.isArray(formData[group.id]) 
                    ? formData[group.id] 
                    : (formData[group.id] ? [formData[group.id]] : []);
                
                // Un grupo repetible vacío no es válido si es requerido
                if (group.required && groupInstances.length === 0) {
                    formIsValid = false;
                    break;
                }
                
                // Validar cada instancia del grupo repetible
                for (const instance of groupInstances) {
                    // Si tiene subgrupos
                    if (group.subGroups) {
                        for (const subGroup of group.subGroups) {
                            if (!validateSubGroup(instance[subGroup.id], subGroup)) {
                                formIsValid = false;
                                break;
                            }
                        }
                    } 
                    // Si tiene inputs directos
                    else if (group.inputs) {
                        for (const input of group.inputs) {
                            if (!validateInput(instance, input)) {
                                formIsValid = false;
                                break;
                            }
                        }
                    }
                    
                    if (!formIsValid) break;
                }
            } 
            // Grupo normal con subgrupos
            else if (group.subGroups) {
                const groupData = formData[group.id] || {};
                
                for (const subGroup of group.subGroups) {
                    if (!validateSubGroup(groupData[subGroup.id], subGroup)) {
                        formIsValid = false;
                        break;
                    }
                }
            }
            // Grupo normal con inputs
            else if (group.inputs) {
                const groupData = formData[group.id] || {};
                for (const input of group.inputs) {
                    if (!validateInput(groupData, input)) {
                        formIsValid = false;
                        break;
                    }
                }
            } 
            // Input directo en el grupo
            else {
                if (!validateInput(formData, group)) {
                    formIsValid = false;
                }
            }

            if (!formIsValid) break;
        }

        setIsCurrentFormValid(formIsValid);
    }, [formData, formConfig, setIsCurrentFormValid]);

    /**
     * handleSubmit: se llama cuando se hace click en "Próximo paso".
     */
    const handleSubmit = () => {
        if (!formConfig) return false;
        
        // Verificar validez nativa sin forzar reportValidity
        let nativeValidationPassed = true;
        if (formRef.current) {
            nativeValidationPassed = formRef.current.checkValidity();
        }
        
        // Continuar con la validación personalizada existente
        let isFormValid = true;

        for (const group of formConfig.groups) {
            if (group.enabled === false) continue;

            if (group.inputs) {
                const groupData = formData[group.id] || {};
                for (const input of group.inputs) {
                    if (!validateInput(groupData, input)) {
                        isFormValid = false;
                        break;
                    }
                }
            } else {
                if (!validateInput(formData, group)) {
                    isFormValid = false;
                }
            }

            if (!isFormValid) break;
        }

        // Devolver resultado combinado de ambas validaciones
        return nativeValidationPassed && isFormValid;
    };

    // Manejador del evento submit del formulario
    const onFormSubmit = (e) => {
        e.preventDefault(); // Evitar envío real
    };

    // Se registra la función de submit en el contexto
    useEffect(() => {
        setSubmitCurrentForm(() => handleSubmit);
        return () => setSubmitCurrentForm(() => () => false);
    }, [setSubmitCurrentForm, formConfig, formData]);

    // Función mejorada para duplicar grupos con focus automático
    const handleDuplicateGroup = (groupId) => {
        console.log("Solicitando duplicación de grupo:", groupId);
        
        // Verificar si el grupo ya existe en formData
        const groupExists = formData && groupId in formData;
        
        if (!groupExists) {
            console.log("El grupo no existe, inicializando primero:", groupId);
            // Si el grupo no existe, primero inicializamos con un array vacío
            updateFormData(groupId, []);
            
            // Usar setTimeout para asegurar que el estado se actualice antes de duplicar
            setTimeout(() => {
                duplicateGroup(groupId);
                // Esperamos otro ciclo para hacer scroll a la nueva instancia
                setTimeout(() => scrollToLastInstance(groupId), 100);
            }, 10);
        } else {
            // Si el grupo ya existe, simplemente duplicamos
            duplicateGroup(groupId);
            // Esperamos a que el DOM se actualice antes de hacer scroll
            setTimeout(() => scrollToLastInstance(groupId), 100);
        }
    };

    // Función para hacer scroll a la última instancia de un grupo
    const scrollToLastInstance = (groupId) => {
        // Buscar todas las instancias del grupo
        const instances = document.querySelectorAll(`[data-group-id="${groupId}"].repeatable-instance`);
        
        if (instances.length > 0) {
            // Obtener la última instancia
            const lastInstance = instances[instances.length - 1];
            
            // Encontrar el contenedor con scroll
            const scrollContainer = document.querySelector('.forms-content');
            
            if (scrollContainer) {
                // Calcular la posición para el scroll
                const containerRect = scrollContainer.getBoundingClientRect();
                const instanceRect = lastInstance.getBoundingClientRect();
                
                // Hacer scroll suave hacia la nueva instancia
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollTop + (instanceRect.top - containerRect.top) - 20,
                    behavior: 'smooth'
                });
                
                // Opcionalmente, agregar un efecto visual para destacar la nueva instancia
                lastInstance.classList.add('highlight-new-instance');
                setTimeout(() => {
                    lastInstance.classList.remove('highlight-new-instance');
                }, 2000);
            } else {
                // Fallback si no encontramos el contenedor específico
                lastInstance.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    if (!hasMounted) return null;
    if (!formConfig || !formConfig.groups) {
        return <div>Configuración no encontrada para el formulario</div>;
    }

    return (
        <form 
            ref={formRef} 
            onSubmit={onFormSubmit} 
            noValidate={false}
            className="form-container"
        >
            {formConfig.title && <h1>{formConfig.title}</h1>}
            {formConfig.description && <p>{formConfig.description}</p>}

            {formConfig.groups.map((group) => {
                if (group.enabled === false) return null;

                // Grupo repetible
                if (group.repeatable) {
                    // Inicialización mejorada de instancias
                    let groupInstances = [];
                    
                    if (formData[group.id]) {
                        if (Array.isArray(formData[group.id])) {
                            groupInstances = formData[group.id];
                        } else {
                            groupInstances = [formData[group.id]];
                        }
                    } else {
                        groupInstances = [{ _id: Date.now() + Math.floor(Math.random() * 1000) }];
                    }
                    
                    // Garantizar que siempre hay al menos una instancia con ID
                    if (groupInstances.length === 0) {
                        groupInstances.push({ _id: Date.now() + Math.floor(Math.random() * 1000) });
                    }
                    
                    // Asegurar que todas las instancias tienen un _id
                    groupInstances.forEach((instance, idx) => {
                        if (!instance._id) {
                            instance._id = Date.now() + idx + Math.floor(Math.random() * 1000);
                        }
                    });
                    
                    // Si el grupo repetible debe mostrarse como acordeón
                    if (group.isAccordion) {
                        return (
                            <Accordion
                                key={group.id}
                                title={group.accordionTitle || group.title || "Sección"}
                                defaultOpen={group.defaultOpen}
                            >
                                <div className="repeatable-group-container">
                                    {groupInstances.map((instance, index) => (
                                        <FormGroup 
                                            key={instance._id || index}
                                            group={group} 
                                            groupData={instance}
                                            isInAccordion={true}
                                            isRepeatable={true}
                                            instanceIndex={index}
                                            canDelete={index > 0} // Solo permitir eliminar si no es la primera instancia
                                            data-group-id={group.id} // Añadir este atributo para identificar el grupo
                                        />
                                    ))}
                                    
                                    <button 
                                        type="button" 
                                        className="add-group-btn"
                                        onClick={() => handleDuplicateGroup(group.id)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> Aggiungi {group.accordionTitle || group.title || "Sezione"}
                                    </button>
                                </div>
                            </Accordion>
                        );
                    }
                    
                    // Grupo repetible sin acordeón
                    return (
                        <div key={group.id} className="repeatable-group-container">
                            {groupInstances.map((instance, index) => (
                                <FormGroup 
                                    key={instance._id || index}
                                    group={group} 
                                    groupData={instance}
                                    isRepeatable={true}
                                    instanceIndex={index}
                                    canDelete={index > 0} // Solo permitir eliminar si no es la primera instancia
                                    data-group-id={group.id} // Añadir este atributo para identificar el grupo
                                />
                            ))}
                            
                            <button 
                                type="button" 
                                className="add-group-btn"
                                onClick={() => handleDuplicateGroup(group.id)}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Aggiungi {group.title || "Sezione"}
                            </button>
                        </div>
                    );
                }

                // Grupo normal con acordeón
                if (group.isAccordion) {
                    return (
                        <Accordion
                            key={group.id}
                            title={group.accordionTitle || group.title || "Sección"}
                            defaultOpen={group.defaultOpen}
                        >
                            {group.subGroups ? (
                                <div>
                                    {group.subGroups.map(subGroup => (
                                        <FormGroup 
                                            key={subGroup.id}
                                            group={subGroup} 
                                            groupData={formData[group.id]?.[subGroup.id]} 
                                            isInAccordion={true}
                                            parentGroupId={group.id}
                                        />
                                    ))}
                                </div>
                            ) : group.inputs ? (
                                <FormGroup 
                                    group={group} 
                                    groupData={formData[group.id]} 
                                    isInAccordion={true}
                                />
                            ) : (
                                <div>
                                    <FormInput
                                        config={group}
                                        value={formData[group.id]}
                                        onChange={(value) => updateFormData(group.id, value)}
                                    />
                                </div>
                            )}
                        </Accordion>
                    );
                }

                // Grupo normal sin acordeón
                if (group.subGroups) {
                    return (
                        <div key={group.id}>
                            {group.title && <h2>{group.title}</h2>}
                            {group.description && <p>{group.description}</p>}
                            
                            {group.subGroups.map(subGroup => (
                                <FormGroup
                                    key={subGroup.id}
                                    group={subGroup}
                                    groupData={formData[group.id]?.[subGroup.id]}
                                    parentGroupId={group.id}
                                />
                            ))}
                        </div>
                    );
                } else if (group.inputs) {
                    return (
                        <FormGroup
                            key={group.id}
                            group={group}
                            groupData={formData[group.id]}
                        />
                    );
                } else {
                    return (
                        <div key={group.id}>
                            <FormInput
                                config={group}
                                value={formData[group.id]}
                                onChange={(value) => updateFormData(group.id, value)}
                            />
                        </div>
                    );
                }
            })}
        </form>
    );
}

export default FormContainer;
