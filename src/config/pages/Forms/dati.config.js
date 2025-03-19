// formConfig.js
const formConfig = {
    // title: "Formulario Extenso con Múltiples Acordeones",
    // description: "Complete la información en cada sección.",
    isColumn: true,
    groups: [
        {
            id: "personalData",
            // title: "Información Personal", // This will be shown inside the accordion content if needed
            accordionTitle: "Datos Personales", // This will be shown in accordion header
            isAccordion: true,
            defaultOpen: true,
            layout: {
                columns: 2,               // Dos columnas por defecto
                gap: "large",             // Espacio grande entre elementos
                alignment: "start",       // Alineación superior
                responsive: {
                    tablet: 2,              // Mantener 2 columnas en tablet
                    mobile: 1               // Una columna en móviles
                }
            },
            inputs: [
                { id: "firstName", type: "text", label: "Nombre", required: true },
                { id: "lastName", type: "text", label: "Apellido", required: true },
                { id: "email", type: "email", label: "Correo Electrónico", required: true },
                { id: "phone", type: "tel", label: "Teléfono", required: false },
            ],
        },
        {
            id: "address",
            accordionTitle: "Dirección", // Only using accordionTitle if you want to hide the title inside
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
            accordionTitle: "Documentos",
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
            accordionTitle: "Preferencias",
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
            accordionTitle: "Información Adicional",
            isAccordion: true,
            defaultOpen: false,
            inputs: [
                { id: "comments", type: "text", label: "Comentarios", required: false },
            ],
        },
    ],
};

export default formConfig;
