// /config/forms.config.js
export const formsConfig = {
    es: {
        serviciPage: {
            groups: [
                // grupo con dos optionSelector
                {
                    id: "servici",
                    // title: "Preferencias y Servicios",
                    description: "Per accedere ai nostri servizi é necessario essere socio, se non lo sei ancora clicca qui e associati.",
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
    en: {
        // Listo para usar
    },
    it: {
        // Listo para usar
    },
};
