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
                    id: "fidejussione",
                    type: "fidejussione",
                    required: true,
                    // label: "Scegli la tipologia di fidejussione",
                    warningMessage: "È necessario selezionare un'opzione",
                    allowMultiple: false,
                    columns: [
                        {
                            id: "option",
                            title: "Scegli la tipologia di fidejussione",
                            type: "button",
                            fieldName: "label",
                            width: "40%",
                            inputWidth: "100%",
                        },
                        {
                            id: "importo",
                            title: "Importo (€)",
                            type: "number",
                            fieldName: "importo",
                            prefix: "€",
                            requiresSelection: true,
                            width: "20%",
                            inputWidth: "100%",
                            inputProps: {
                                step: "0.1",
                                min: "0"
                            }
                        },
                        {
                            id: "durata",
                            title: "Durata (Mesi)",
                            type: "number",
                            suffix: "Mesi",
                            fieldName: "durata",
                            requiresSelection: true,
                            width: "40%",
                            inputWidth: "100%",
                            inputProps: {
                                step: "1",
                                min: "0",
                                max: "36"
                            },
                        }
                    ],
                    options: [
                        {
                            label: "Fidejussione Rimborso IVA",
                            value: "rimborsoIVA",
                            importo: 0.0,
                            durata: 36,
                            // Forzamos a deshabilitar la columna 'durata' incluso si se selecciona
                            disabledColumns: ["durata"]
                        },
                        {
                            label: "Fidejussione autotrasporti",
                            value: "autotrasporti",
                            importo: 0.0,
                            durata: 12,
                            disabledColumns: ["durata"]
                        },
                        {
                            label: "Fidejussione CSA 2011",
                            value: "csa2011",
                            importo: 0.0,
                            durata: 12,
                            disabledColumns: ["durata"]
                        },
                        {
                            label: "Fidejussione COTRA",
                            value: "cotra",
                            importo: 0.0,
                            durata: 12,
                            disabledColumns: ["durata"]
                        },
                        {
                            label: "Fidejussione CUT",
                            value: "cut",
                            importo: 0.0,
                            durata: 12,
                            disabledColumns: ["durata"]
                        },
                        {
                            label: "Fidejussione Gestor",
                            value: "gestor",
                            importo: 0.0,
                            // Esta es la última fila, donde sí se puede editar 'durata' si se selecciona
                            durata: "",
                            placeholder: "Quantità di mesi (Max 36)",
                            disabledColumns: []
                        }
                    ]
                }
            ]
        },
        {
            id: "Importo Mutuo e Durata Finalità",
            accordionTitle: "Importo Mutuo e Durata Finalità",
            // description: "Puoi configurare ulteriori garanzie secondarie se necessario.",
            isAccordion: true,
            defaultOpen: false,
            layout: {
                columns: 1,
                gap: "normal",
                alignment: "start"
            },
            inputs: [
                {
                    id: "altre_garanzie",
                    type: "fidejussione",
                    required: true,
                    warningMessage: "È necessario configurare almeno una garanzia",
                    allowMultiple: false,
                    columns: [
                        {
                            id: "destinazioneFinanziamento",
                            title: "Destinazione Finanziamento",
                            type: "selector",
                            label: "Destinazione", // Añadir explícitamente para mayor seguridad
                            fieldName: "destinazioneFinanziamento",
                            width: "40%",
                            multiple: true,
                            required: true
                        },
                        {
                            id: "inserisciLimportoRichiesto",
                            title: "Inserisci l’importo richiesto (€)",
                            placeholder: "Max 200.000",
                            type: "number",
                            fieldName: "inserisciLimportoRichiesto",
                            prefix: "€",
                            requiresSelection: true,
                            width: "30%",
                            inputWidth: "100%",
                            inputProps: {
                                step: "0.01",
                                min: "0"
                            }
                        },
                        {
                            id: "durata",
                            title: "Durata",
                            type: "number",
                            fieldName: "durata",
                            placeholder: "Da 36 a 84",
                            requiresSelection: true,
                            width: "30%",
                            suffix: "Mesi",
                            inputWidth: "100%",
                            inputProps: {
                                step: "1",
                                min: "36",
                                max: "84"
                            }
                        }
                    ],
                    options: [
                        {
                            value: "row1",
                            destinazioneFinanziamento: "",
                            inserisciLimportoRichiesto: "",
                            durata: "",
                            selectorOptions: [
                                { value: "Liquidità (pagamento scorte,fornitori, servizi e personale)", label: "Liquidità (pagamento scorte,fornitori, servizi e personale)" },
                                { value: "Investimento", label: "Investimento" },
                                { value: "Rinegoziazione debiti a medio/lungo termine", label: "Rinegoziazione debiti a medio/lungo termine" },
                                { value: "Consolidamento di passività a breve termine", label: "Consolidamento di passività a breve termine" },
                            ]
                        }
                    ]
                },
                {
                    id: "noteAggiuntive",
                    type: "textarea",
                    label: "lteriori informazioni descrittive per comprendere meglio la finalità dell’investimento",
                    placeholder: "Inserisci ulteriori informazioni o dettagli sul finanziamento richiesto",
                    required: false,
                    rows: 4
                }
            ]
        },
        {
            id: "Compagine Sociale",
            accordionTitle: "Compagine Sociale",
            description: "La compagine sociale si riferisce all'insieme dei soci o azionisti di una società e alla ripartizione delle loro quote di partecipazione. In altre parole, rappresenta la struttura proprietaria dell'azienda, indicando chi ne detiene le quote o azioni e in quale misura.",
            isAccordion: true,
            defaultOpen: true, // Abrir por defecto para que sea visible
            layout: {
                columns: 1,
                gap: "normal",
                alignment: "start"
            },
            inputs: [
                {
                    id: "campi_testo_multipli",
                    type: "fidejussione",
                    required: false,
                    warningMessage: "È necessario compilare almeno una riga",
                    allowMultiple: true,
                    allowAddRows: true, // Asegurarse que esté habilitado
                    columns: [
                        {
                            id: "CognomeNomeoRagioneSociale",
                            title: "Cognome Nome o Ragione Sociale",
                            type: "text",
                            fieldName: "CognomeNomeoRagioneSociale",
                            width: "22%",
                            placeholder: ""
                        },
                        {
                            id: "CodiceFiscale",
                            title: "Codice Fiscale",
                            type: "text",
                            fieldName: "CodiceFiscale",
                            width: "22%",
                            placeholder: ""
                        },
                        {
                            id: "Quota",
                            title: "Quota %",
                            type: "number",
                            fieldName: "Quota",
                            width: "22%",
                            placeholder: "",
                            inputProps: {
                                step: "0.1",
                                min: "0",
                                max: "100"
                            }
                        },
                        {
                            id: "Carica",
                            title: "Carica",
                            type: "text",
                            fieldName: "Carica",
                            width: "22%",
                            placeholder: ""
                        }
                    ],
                    options: [
                        {
                            value: "row1",
                            CognomeNomeoRagioneSociale: "",
                            CodiceFiscale: "",
                            Quota: "",
                            Carica: ""
                        }
                    ]
                }
            ]
        }
    ],
};

export default formConfig;
