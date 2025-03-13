"use client";
import React, { useEffect } from "react";
import { useFormsContext } from "@/context/FormsContext";
import FormGroup from "./FormGroup";
import { useTranslation } from "@/config/i18n";
import useHasMounted from "@/hooks/useHasMounted";
import { formsConfig } from "@/config/pages/Forms/serviciPage.config";
import FormInput from "./FormInput";

function FormContainer({ formKey }) {
    const hasMounted = useHasMounted();
    const {
        formData,
        updateFormData,
        setIsCurrentFormValid,
        setSubmitCurrentForm
    } = useFormsContext();
    const { locale } = useTranslation();
    const formConfig = formsConfig[locale] && formsConfig[locale][formKey];



    // Inicializa los datos de cada grupo, ya sea un grupo de inputs o un input directo
    useEffect(() => {
        formConfig.groups.forEach((group) => {
            if (group.inputs) {
                // Grupo con inputs: inicializamos cada input según su defaultValue
                if (!formData[group.id]) {
                    const defaultGroupData = {};
                    (group.inputs || []).forEach((input) => {
                        defaultGroupData[input.id] = input.defaultValue || "";
                    });
                    updateFormData(group.id, defaultGroupData);
                }
            } else {
                // Input directo: inicializamos con su defaultValue
                if (formData[group.id] === undefined) {
                    updateFormData(group.id, group.defaultValue || "");
                }
            }
        });
    }, [formConfig, formData, updateFormData]);


    // Validación general del formulario
    const isFormValid = formConfig.groups.every((group) => {
        if (group.inputs) {
            const groupData = formData[group.id] || {};
            return (group.inputs || []).every((input) => {
                if (input.required) {
                    return groupData[input.id] && groupData[input.id] !== "";
                }
                return true;
            });
        } else {
            // Input directo
            if (group.required) {
                return formData[group.id] && formData[group.id] !== "";
            }
            return true;
        }
    });

    const handleSubmit = () => {
        if (isFormValid) {
            formConfig.onSubmit && formConfig.onSubmit(formData);
            return true; // Indica que el envío fue exitoso
        } else {
            alert("Por favor, complete todos los campos requeridos.");
            return false; // Indica que el envío falló
        }
    };

    // Actualiza el estado de validez del formulario en el contexto
    useEffect(() => {
        setIsCurrentFormValid(isFormValid);
    }, [isFormValid, setIsCurrentFormValid]);

    // Proporciona la función de submit al contexto
    useEffect(() => {
        setSubmitCurrentForm(() => handleSubmit);
        // Limpieza al desmontar
        return () => setSubmitCurrentForm(() => () => { });
    }, [setSubmitCurrentForm, isFormValid, formData]);

    if (!hasMounted) return null;
    if (!formConfig || !formConfig.groups) {
        return <div>Configuración no encontrada para el formulario</div>;
    }

    return (
        <div>
            <h1>{formConfig.title}</h1>
            <p>{formConfig.description}</p>
            {formConfig.groups.map((group) => {
                if (group.inputs) {
                    return (
                        <FormGroup
                            key={group.id}
                            group={group}
                            groupData={formData[group.id]}
                        />
                    );
                } else {
                    return (
                        <FormInput
                            key={group.id}
                            config={group}
                            value={formData[group.id]}
                            onChange={(value) => updateFormData(group.id, value)}
                        />
                    );
                }
            })}
            {/* El botón de submit se ha eliminado, ahora se usa el de FormsFooter */}
        </div>
    );
}

export default FormContainer;
