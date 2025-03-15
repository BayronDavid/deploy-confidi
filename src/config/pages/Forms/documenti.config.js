// /config/forms.config.js
export const formsConfig = {
    es: {
        documentiPage: {
            groups: [
                {
                    id: "documentiRichiesti",
                    title: "Carica i documenti richiesti",
                    // description: "Sube cada documento o marca 'No' si no aplica a tu caso.",
                    isColumn: true,
                    inputs: [
                        {
                            id: "documentosRequeridos",
                            title: "Documentos Requeridos",
                            description: "Suba el documento de identidad.",
                            required: true, // Es obligatorio: debe subir un archivo
                            // Se usa un input directo, sin agrupar varios campos
                            type: "documentRequest",
                            isOptional: false, // Al ser obligatorio, no se muestra la opción "No"
                            primaryButtonLabel: "Subir documento",
                            skipButtonLabel: "No", // No se usará porque es obligatorio
                        },
                        {
                            id: "documentosRequeridoss",
                            title: "Documentos Requeridos",
                            description: "Suba el documento de identidad.",
                            required: true, // Es obligatorio: debe subir un archivo
                            // Se usa un input directo, sin agrupar varios campos
                            type: "documentRequest",
                            isOptional: true, // Al ser obligatorio, no se muestra la opción "No"
                            primaryButtonLabel: "Subir documento",
                            skipButtonLabel: "No", // No se usará porque es obligatorio
                        },
                       
                    ],
                },
            ],
        },
    },
    en: {
        // Listo para usar
    },
    it: {
        // Listo para usar
    },
};
