// /config/forms.config.js
export const formsConfig = {
    es: {
        serviciPage: {
            groups: [
                {
                    id: "servici",
                    description: "Para acceder a nuestros servicios es necesario ser socio; si aún no lo eres, haz clic aquí y asóciate.",
                    enabled: true,
                    inputs: [
                        {
                            id: "Categoria",
                            type: "optionSelector",
                            label: "Selecciona a qué categoría perteneces",
                            enabled: true,
                            required: true,
                            allowMultiple: false,
                            options: [
                                { label: "Empresa Individual", value: "Impresa Individuale" },
                                { label: "Sociedad de Personas", value: "società persone" },
                                { label: "Profesional Independiente", value: "libero professionista" },
                                { label: "Sociedad de Capital", value: "società capitali" },
                            ],
                            defaultValue: []
                        },
                        {
                            id: "Servicio",
                            type: "optionSelector",
                            label: "Selecciona el servicio deseado",
                            enabled: true,
                            required: true,
                            allowMultiple: false,
                            options: [
                                { label: "Garantía Colectiva", value: "garanzia" },
                                { label: "Fianzas Comerciales", value: "fidejussioni" },
                                { label: "Préstamo Quirografario", value: "mutuo" },
                            ],
                            defaultValue: []
                        }
                    ]
                },
            ]
        },
    },
    en: {
        serviciPage: {
            groups: [
                {
                    id: "servici",
                    description: "To access our services, you must be a member; if you're not yet, click here to join.",
                    enabled: true,
                    inputs: [
                        {
                            id: "Categoria",
                            type: "optionSelector",
                            label: "Select the category you belong to",
                            enabled: true,
                            required: true,
                            allowMultiple: false,
                            options: [
                                { label: "Sole Proprietorship", value: "Impresa Individuale" },
                                { label: "Partnership", value: "società persone" },
                                { label: "Independent Professional", value: "libero professionista" },
                                { label: "Corporation", value: "società capitali" },
                            ],
                            defaultValue: []
                        },
                        {
                            id: "Servicio",
                            type: "optionSelector",
                            label: "Select the desired service",
                            enabled: true,
                            required: true,
                            allowMultiple: false,
                            options: [
                                { label: "Collective Guarantee", value: "garanzia" },
                                { label: "Commercial Sureties", value: "fidejussioni" },
                                { label: "Unsecured Loan", value: "mutuo" },
                            ],
                            defaultValue: []
                        }
                    ]
                },
            ]
        },
    },
    it: {
        serviciPage: {
            groups: [
                {
                    id: "servici",
                    description: "Per accedere ai nostri servizi è necessario essere socio, se non lo sei ancora clicca qui e associati.",
                    enabled: true,
                    inputs: [
                        {
                            id: "Categoria",
                            type: "optionSelector",
                            label: "Seleziona a quale categoria appartieni",
                            enabled: true,
                            required: true,
                            allowMultiple: false,
                            options: [
                                { label: "Impresa Individuale", value: "Impresa Individuale" },
                                { label: "Società di Persone", value: "società persone" },
                                { label: "Libero Professionista", value: "libero professionista" },
                                { label: "Società di Capitale", value: "società capitali" },
                            ],
                            defaultValue: []
                        },
                        {
                            id: "Servicio",
                            type: "optionSelector",
                            label: "Seleziona il Servizio desiderato",
                            enabled: true,
                            required: true,
                            allowMultiple: false,
                            options: [
                                { label: "Garanzia Collettiva", value: "garanzia" },
                                { label: "Fidejussioni Commerciali", value: "fidejussioni" },
                                { label: "Mutuo Chirografario", value: "mutuo" },
                            ],
                            defaultValue: []
                        }
                    ]
                },
            ]
        },
    },
};
