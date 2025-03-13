// /components/FormContainer.js
"use client";
import React, { useEffect } from "react";
import { useFormsContext } from "@/context/FormsContext";
import FormGroup from "./FormGroup";
import { useTranslation } from "@/config/i18n";
import useHasMounted from "@/hooks/useHasMounted";
import { formsConfig } from "@/config/pages/Forms/serviciPage.config";

function FormContainer({ formKey }) {
    const hasMounted = useHasMounted();
    const { formData, updateFormData } = useFormsContext();
    const { locale } = useTranslation();
    const formConfig = formsConfig[locale][formKey];

    // Inicializa los datos de cada grupo con los defaultValue de la configuración
    useEffect(() => {
        formConfig.groups.forEach((group) => {
            if (!formData[group.id]) {
                const defaultGroupData = {};
                group.inputs.forEach((input) => {
                    defaultGroupData[input.id] = input.defaultValue || "";
                });
                updateFormData(group.id, defaultGroupData);
            }
        });
    }, [formConfig, formData, updateFormData]);

    // Si aún no se ha montado, no renderizamos nada
    if (!hasMounted) return null;

    // Validación general del formulario: todos los inputs requeridos deben tener valor
    const isFormValid = formConfig.groups.every((group) => {
        const groupData = formData[group.id] || {};
        return group.inputs.every((input) => {
            if (input.required) {
                return groupData[input.id] && groupData[input.id] !== "";
            }
            return true;
        });
    });

    const handleSubmit = () => {
        if (isFormValid) {
            formConfig.onSubmit(formData);
        } else {
            alert("Por favor, complete todos los campos requeridos.");
        }
    };

    return (
        <div>
            <h1>{formConfig.title}</h1>
            <p>{formConfig.description}</p>
            {formConfig.groups.map((group) => (
                <FormGroup key={group.id} group={group} groupData={formData[group.id]} />
            ))}
            <button onClick={handleSubmit} disabled={!isFormValid}>
                Enviar
            </button>
        </div>
    );
}

export default FormContainer;
