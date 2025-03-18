// formConfig.js
const formConfig = {
    // title: "Formulario Extenso con Múltiples Acordeones",
    // description: "Complete la información en cada sección.",
    isColumn: true,
    groups: [
        {
            id: "personalData",
            title: "Datos Personales",
            isAccordion: true,
            defaultOpen: true,
            isColumn: true,
            inputs: [
                { id: "firstName", type: "text", label: "Nombre", required: true },
                { id: "lastName", type: "text", label: "Apellido", required: true },
                { id: "email", type: "email", label: "Correo Electrónico", required: true },
                { id: "phone", type: "tel", label: "Teléfono", required: false },
            ],
        },
        {
            id: "address",
            title: "Dirección",
            isAccordion: true,
            defaultOpen: false,
            inputs: [
                { id: "street", type: "text", label: "Calle", required: true },
                { id: "city", type: "text", label: "Ciudad", required: true },
                { id: "state", type: "text", label: "Estado", required: true },
                { id: "zip", type: "number", label: "Código Postal", required: true },
            ],
        },
        {
            id: "documents",
            title: "Documentos",
            isAccordion: true,
            defaultOpen: false,
            inputs: [
                {
                    id: "idDocument",
                    type: "documentRequest",
                    label: "Documento de Identidad",
                    required: true,
                    isOptional: false,
                },
                {
                    id: "proofOfAddress",
                    type: "documentRequest",
                    label: "Comprobante de Domicilio",
                    required: false,
                    isOptional: true,
                },
            ],
        },
        {
            id: "preferences",
            title: "Preferencias",
            isAccordion: true,
            defaultOpen: true,
            inputs: [
                {
                    id: "contactMethod",
                    type: "optionSelector",
                    label: "Método de Contacto",
                    required: true,
                    options: [
                        { value: "email", label: "Correo Electrónico" },
                        { value: "phone", label: "Teléfono" },
                    ],
                },
                {
                    id: "newsletter",
                    type: "optionSelector",
                    label: "Suscribirse al Boletín",
                    required: false,
                    options: [
                        { value: "yes", label: "Sí" },
                        { value: "no", label: "No" },
                    ],
                },
            ],
        },
        {
            id: "additionalInfo",
            title: "Información Adicional",
            isAccordion: true,
            defaultOpen: false,
            inputs: [
                { id: "comments", type: "text", label: "Comentarios", required: false },
            ],
        },
    ],
};

export default formConfig;
