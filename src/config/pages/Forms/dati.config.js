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
                columns: 3,           // tres columnas por defecto
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
            layout: {
                columns: 3,           // tres columnas por defecto
                gap: "large",             // Espacio grande entre elementos
                alignment: "start",       // Alineación superior
                responsive: {
                    tablet: 2,              // Mantener 2 columnas en tablet
                    mobile: 1               // Una columna en móviles
                },
            },
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
            id: "infoBanca_",
            accordionTitle: "Dati istituto di credito e tipologia di finanziamento",
            description:
                "La tipologia e la percentuale di garanzia saranno definite successivamente in accordo con la banca finanziatrice",
            isAccordion: true,
            defaultOpen: false,
            // Para poder duplicar este bloque 
            repeatable: true,
            subGroups: [
                {
                    id: "infoBanca",
                    title: "Informazioni Principali",
                    // Layout de 3 columnas para los campos de texto
                    layout: {
                        columns: 3,
                        gap: "normal",
                        alignment: "start",
                        responsive: {
                            tablet: 2,
                            mobile: 1
                        }
                    },
                    inputs: [
                        {
                            id: "nomeIstitutoCredito",
                            type: "text",
                            label: "Nome Istituto Di Credito",
                            required: true
                        },
                        {
                            id: "filiale",
                            type: "text",
                            label: "Filiale",
                            required: true
                        },
                        {
                            id: "nomeReferenteBanca",
                            type: "text",
                            label: "Nome del Referente Banca",
                            required: true
                        },
                        {
                            id: "mailReferenteBanca",
                            type: "email",
                            label: "Mail del Referente Banca",
                            required: true
                        },
                        {
                            id: "telefonoReferenteBanca",
                            type: "tel",
                            label: "Telefono del Referente Banca",
                            required: true
                        },
                        {
                            id: "formaTecnica",
                            type: "text",
                            label: "Forma Tecnica",
                            required: true
                        },
                        {
                            id: "importoFinanziamento",
                            type: "number",
                            label: "Importo del Finanziamento",
                            required: true
                        },
                        {
                            id: "durata",
                            type: "number",
                            label: "Durata (In Mesi)",
                            required: true
                        },
                        {
                            id: "preammortamento",
                            type: "number",
                            label: "Preammortamento (In Mesi)",
                            required: false
                        }
                    ]
                },
                {
                    id: "finalitaFinanziamento",
                    title: "Finalità del Finanziamento",
                    // 1 sola columna para el select y textarea
                    layout: {
                        columns: 1,
                        gap: "normal",
                        alignment: "start"
                    },
                    inputs: [
                        {
                            id: "intereses",
                            type: "select",
                            label: "Intereses",
                            multiple: true,
                            maxSelections: 4, // opcional
                            options: [
                                {
                                    value:
                                        "Liquidità (pagamento scorte,fornitori, servizi e personale)",
                                    label:
                                        "Liquidità (pagamento scorte,fornitori, servizi e personale)"
                                },
                                { value: "Investimento", label: "Investimento" },
                                {
                                    value: "Rinegoziazione debiti a medio/lungo termine",
                                    label: "Rinegoziazione debiti a medio/lungo termine"
                                },
                                {
                                    value: "Consolidamento di passività a breve termine",
                                    label: "Consolidamento di passività a breve termine"
                                }
                            ],
                            required: true
                        },
                        {
                            id: "ulteriorInformazioni",
                            type: "textarea",
                            label:
                                "Ulteriori informazioni descrittive per comprendere meglio l’investimento",
                            required: false
                        }
                    ]
                },

            ]
        },
        {
            id: "fidejussione_accordion",
            // title: "Garanzie",
            accordionTitle: "Tipologia fidejussione",
            description:
                "In caso di rinnovo di Fidejussione quella precedente dovrà essere restituita al momento di rilascio della nuova.  ",
            isAccordion: true,
            layout: {
                columns: 1,
                gap: "normal",
                alignment: "start"
            },
            inputs: [
                {
                    "id": "fidejussione",
                    "type": "fidejussione",
                    "required": true,
                    "allowMultiple": false,
                    "selectionMode": "selector",
                    "warningMessage": "È necessario selezionare un'opzione",
                    "columns": [
                        {
                            "id": "option",
                            "title": "Tipologia di Garanzia",
                            "type": "button",
                            "fieldName": "label",
                            "width": "100%"
                        },
                        {
                            "id": "importo",
                            "title": "Importo (€)",
                            "type": "number",
                            "fieldName": "importo",
                            "prefix": "€",
                            "inputProps": {
                                "step": "0.01",
                                "min": "0"
                            },
                            "editableFor": "personalizzata"
                        },
                        {
                            "id": "durata",
                            "title": "Durata (Mesi)",
                            "type": "text",
                            "fieldName": "durata",
                            "editableFor": "personalizzata"
                        }
                    ],
                    "options": [
                        { "label": "Fidejussione Rimborso IVA", "value": "rimborsoIVA", "importo": "0.00", "durata": "36" },
                        { "label": "Fidejussione autotrasporti", "value": "autotrasporti", "importo": "0.00", "durata": "12" },
                        { "label": "Fidejussione personalizzata", "value": "personalizzata", "importo": "0.00", "durata": "24" }
                    ]
                }

            ]
        }
    ],
};

export default formConfig;
