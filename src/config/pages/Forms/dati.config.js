// formConfig.js
const formConfig = {
    // title: "Formulario Extenso con Múltiples Acordeones",
    // description: "Complete la información en cada sección.",
    isColumn: true,
    groups: [
        {
            id: "personalData",
            // title: "Información Personal", // This will be shown inside the accordion content if needed
            accordionTitle: "Dati del Richiedente", // This will be shown in accordion header
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
                {
                    id: "ragioneSociale",
                    type: "text",
                    label: "Ragione Sociale",
                    required: true,
                    tooltip: "Inserisci la Ragione Sociale"
                },
                {
                    id: "formaGiuridica",
                    type: "text",
                    label: "Forma Giuridica",
                    required: true
                },
                {
                    id: "partitaIva",
                    type: "text",
                    label: "Partita IVA",
                    required: true
                },
                {
                    id: "codiceFiscale",
                    type: "text",
                    label: "Codice Fiscale",
                    required: true
                },
                {
                    id: "codiceAteco",
                    type: "text",
                    label: "Codice Ateco e Attività Esercitata",
                    required: true
                },
                {
                    id: "sedeLegale",
                    type: "text",
                    label: "Sede Legale (Via, N°, Cap, Prov.)",
                    required: true
                },
                {
                    id: "indirizzoPosta",
                    type: "text",
                    label: "Indirizzo di Posta (Via, N°, Cap, Prov.)",
                    required: true
                },
                {
                    id: "telefono",
                    type: "tel",
                    label: "Telefono",
                    required: false
                },
                {
                    id: "email",
                    type: "email",
                    label: "Email",
                    required: false
                },
                {
                    id: "pec",
                    type: "email",
                    label: "Pec",
                    required: false
                }
            ]
        },
        {
            id: "address",
            accordionTitle: "Dati del Legale Rappresentante",
            isAccordion: true,
            defaultOpen: false,
            inputs: [
                {
                    id: "nomeCognome",
                    type: "text",
                    label: "Nome e Cognome",
                    required: true,
                    tooltip: "Inserisci il nome e cognome"
                },
                {
                    id: "carica",
                    type: "text",
                    label: "Carica",
                    required: true
                },
                {
                    id: "natoA",
                    type: "text",
                    label: "Nato a (Luogo e Data)",
                    required: true
                },
                {
                    id: "codiceFiscale",
                    type: "text",
                    label: "Codice Fiscale",
                    required: true
                },
                {
                    id: "residenza",
                    type: "text",
                    label: "Residenza (Via, N°, CAP, Prov.)",
                    required: true
                },
                {
                    id: "domicilio",
                    type: "text",
                    label: "Domicilio (se diverso da residenza)",
                    required: false
                },
                {
                    id: "telefono",
                    type: "tel",
                    label: "Telefono",
                    required: true
                }
            ]
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
