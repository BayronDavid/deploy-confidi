// formConfig.js
const formConfig = {
    // title: "Formulario Extenso con Múltiples Acordeones",
    // description: "Complete la información en cada sección.",
    isColumn: true,
    groups: [
        // 1 - Dati del Richiedente
        {
            id: "1",
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
        // 2 - Dati del Legale Rappresentante"
        {
            id: "2",
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
        // 3 - Dati istituto di credito e tipologia di finanziamento
        {
            id: "3",
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
        // 4 - Tipologia di fidejussione
        {
            id: "4",
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
                    type: "DynamicInputGrid",
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
        // 5 - Importo Mutuo e Durata Finalità
        {
            id: "5",
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
                    type: "DynamicInputGrid",
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
                            required: true,
                            width: "245px",
                            // floatingOptions: true,
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
        // 6 - Compagine Sociale
        {
            id: "6",
            accordionTitle: "Compagine Sociale",
            description: "La compagine sociale si riferisce all'insieme dei soci o azionisti di una società e alla ripartizione delle loro quote di partecipazione. In altre parole, rappresenta la struttura proprietaria dell'azienda, indicando chi ne detiene le quote o azioni e in quale misura.",
            isAccordion: true,
            defaultOpen: false, // Abrir por defecto para que sea visible
            layout: {
                columns: 1,
                gap: "normal",
                alignment: "start"
            },
            inputs: [
                {
                    id: "campi_testo_multipli",
                    type: "DynamicInputGrid",
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
        },
        // 7 - Calcolo Dimensione Aziendale
        {
            id: "7",
            accordionTitle: "Calcolo Dimensione Aziendale",
            description: "Calcolo della dimensione aziendale secondo i parametri UE. Inserire i dati dell'impresa richiedente e delle eventuali imprese collegate o associate.",
            isAccordion: true,
            defaultOpen: false,
            layout: {
                columns: 1,
                gap: "normal",
                alignment: "start"
            },
            inputs: [
                {
                    id: "dimensioneAziendale",
                    type: "calcoloDimensioneAziendale",
                    required: true,
                    tooltip: "Compilare i dati per calcolare la dimensione aziendale"
                }
            ]
        },
        // 8 - Dimensione Aziendale
        {
            id: "8",
            accordionTitle: "Dimensione Aziendale",
            description:
                `   <p>Questa classificazione si basa sul Decreto Ministeriale del 18 aprile 2005:</p>
                    <ul>
                    <li><strong>Microimpresa</strong>: meno di 10 dipendenti e un fatturato o bilancio annuo non superiore a 2 milioni di euro.</li>
                    <li><strong>Piccola impresa</strong>: tra 10 e 49 dipendenti, con un fatturato o bilancio annuo non superiore a 10 milioni di euro.</li>
                    <li><strong>Media impresa</strong>: tra 50 e 249 dipendenti e un fatturato annuo fino a 50 milioni di euro o un bilancio annuo non superiore a 43 milioni di euro.</li>
                    </ul>
                    <p>Seleziona l'opzione corrispondente alla tua impresa in base a questi criteri.</p>
                    In base alla definizione comunitaria disciplinata dal D.M. 18 Aprile 2005 l’impresa è:
                    `,
            isAccordion: true,
            defaultOpen: false,
            // Para poder duplicar este bloque 
            // repeatable: true,
            subGroups: [
                {
                    id: "finalitaFinanziamento",
                    // title: "Finalità del Finanziamento",
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
                            multiple: false,
                            maxSelections: 4, // opcional
                            options: [
                                {
                                    value:
                                        "Microimpresa",
                                    label:
                                        "Microimpresa"
                                },
                                {
                                    value: "Piccola Impresa",
                                    label: "Piccola Impresa"
                                },
                                {
                                    value: "Media Impresa",
                                    label: "Media Impresa"
                                }
                            ],
                            required: true
                        },
                    ]
                },

            ]
        },
        // 9 - Elenco Affidamenti Bancari & Leasing
        {
            id: "9",
            accordionTitle: "Elenco Affidamenti Bancari & Leasing",
            // description: "Calcolo della dimensione aziendale secondo i parametri UE. Inserire i dati dell'impresa richiedente e delle eventuali imprese collegate o associate.",
            isAccordion: true,
            defaultOpen: false,
            layout: {
                columns: 1,
                gap: "normal",
                alignment: "start"
            },
            inputs: [
                {
                    id: "ElencoAffidamentiBancariLeasing",
                    type: "elencoAffidamentiBancariLeasing",
                    required: true,
                    tooltip: "Compilare i dati per calcolare la dimensione aziendale"
                }
            ]
        },
        // 10 - Elenco Proprietà immobiliari al di fuori della Provincia di Trento
        {
            id: "10",
            accordionTitle: "Elenco Proprietà immobiliari al di fuori della Provincia di Trento",
            // description: "Calcolo della dimensione aziendale secondo i parametri UE. Inserire i dati dell'impresa richiedente e delle eventuali imprese collegate o associate.",
            isAccordion: true,
            defaultOpen: false,
            layout: {
                columns: 1,
                gap: "normal",
                alignment: "start"
            },
            inputs: [
                {
                    id: "elencoProprietaImmobiliariFuoriTrento",
                    type: "elencoProprietaImmobiliariFuoriTrento",
                    required: true,
                    tooltip: "Compilare i dati per calcolare la dimensione aziendale"
                }
            ]
        },
        // 11 - Dichiarazioni e Impegni
        {
            id: "11",
            accordionTitle: "Il Richiedente dichiara di:",
            isAccordion: true,
            defaultOpen: false,
            layout: {
                columns: 1,
                gap: "normal",
                alignment: "start"
            },
            inputs: [
                {
                    "id": "checkDeclaraciones",
                    "type": "checklist",
                    // "label": "Dichiarazioni",
                    "required": true,
                    "tooltip": "Leggi attentamente e spunta tutte le caselle richieste.",
                    "options": [
                        {
                            "value": "pendenzeInpsInailAde",
                            "label": "Non avere pendenze o rateizzazioni nei confronti di INPS, INAIL, ADE, e in caso contrario di aver caricato nello Step 2 (relativo al caricamento dei documenti) la documentazione che attesta l'ammontare degli arretrati non rateizzati o la rateizzazione in corso indicando l'ammontare totale del debito (importo complessivo dovuto).",
                            "required": true
                        },
                        {
                            "value": "statutoConoscenza",
                            "label": "Aver preso visione e conoscere integralmente lo Statuto, in particolare Titolo II: requisiti, ammissione, comunicazioni, impedimenti, recesso, esclusione, decadenza, morte ed estinzione. Titolo IV: partecipazioni sociali.",
                            "required": true
                        },
                        {
                            "value": "statutoApprovo",
                            "label": "Approvare e rispettare integralmente lo Statuto e adempire agli obblighi da esso derivanti.",
                            "required": true
                        },
                        {
                            "value": "foglioInformativo",
                            "label": "Aver preso visione del foglio informativo alla data odierna.",
                            "required": true
                        },
                        {
                            "value": "infoCompleteVeritiere",
                            "label": "Garantire che tutte le informazioni e cifre fornite siano complete e veritiere.",
                            "required": true
                        },
                        {
                            "value": "contattoConfidiTrentino",
                            "label": "Essere a conoscenza che Confidi Trentino Imprese SC contatterà la Richiedente per: la consegna della lettera di garanzia, la sottoscrizione del contratto di garanzia e di eventuali dichiarazioni per l'attivazione della controgaranzia del Fondo PMI, e qualsiasi altra formalità necessaria per l'emissione della garanzia.",
                            "required": true
                        },
                        {
                            "value": "surroga",
                            "label": "Essere consapevole che, in caso di escussione della garanzia, Confidi Trentino Imprese SC avrà diritto di surrogarsi nei diritti dell'istituto garantito nei confronti del debitore principale per regresso. La consegna della lettera di garanzia, la sottoscrizione del contratto di garanzia e di eventuali dichiarazioni per l'attivazione della controgaranzia del Fondo PMI e qualsiasi altra formalità necessaria per l'emissione della garanzia.",
                            "required": true
                        },
                        {
                            "value": "autorizzazione",
                            "label": "Autorizzare Confidi Trentino Imprese SC a ottenere tutte le informazioni e documenti necessari dagli istituti garantiti, anche per eventuali fasi successive.",
                            "required": true
                        }
                    ]
                }
            ]
        },
        // 12 - Il Richiedente si impegna a:
        {
            id: "14",
            accordionTitle: "Il Richiedente si impegna a:",
            // description: "Calcolo della dimensione aziendale secondo i parametri UE. Inserire i dati dell'impresa richiedente e delle eventuali imprese collegate o associate.",
            isAccordion: true,
            defaultOpen: false,
            layout: {
                columns: 1,
                gap: "normal",
                alignment: "start"
            },
            inputs: [
                {
                    "id": "checkImpegni",
                    "type": "checklist",
                    // "label": "Impegni del Richiedente",
                    "required": true,
                    "tooltip": "Leggi attentamente e spunta tutte le caselle richieste.",
                    "options": [
                        {
                            "value": "comunicareTempestivamente",
                            "label": "Comunicare tempestivamente ogni informazione o variazione rilevante per la partecipazione a Confidi Trentino Imprese SC o per la gestione delle garanzie.",
                            "required": true
                        },
                        {
                            "value": "fornireDocumentazione",
                            "label": "Fornire la documentazione necessaria per la concessione, il mantenimento e la gestione delle garanzie e dei finanziamenti.",
                            "required": true
                        },
                        {
                            "value": "rispettareObblighi",
                            "label": "Rispettare gli obblighi previsti per i servizi prestati dal Confidi.",
                            "required": true
                        },
                        {
                            "value": "rilasciareMandato",
                            "label": "Rilasciare mandato irrevocabile a Confidi Trentino Imprese SC per liquidare la propria partecipazione sociale e utilizzare il credito risultante per compensare eventuali debiti nei confronti del Confidi.",
                            "required": true
                        }
                    ]
                }
            ]
        }
    ],
    modals: [
        {
            id: "12",
            title: "Informativa al socio/cliente in merito al trattamento dei dati personali",
            content: `
                    <p>
                    Gentile Socio/Cliente, il Confidi pone da sempre particolare attenzione al rispetto degli obblighi di riservatezza nei confronti dei soci e della clientela e adotta nelle proprie attività ogni misura necessaria alla protezione dei dati relativi in essere.
                    </p>

                    <p>
                    Ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 ed in generale in osservanza del principio di trasparenza previsto dal Regolamento medesimo, La informiamo che Confidi, in qualità di <strong>Titolare del Trattamento</strong>, procederà al trattamento dei dati personali, rispetto ai quali Lei riveste la qualifica di interessato ai sensi del menzionato Regolamento, forniti al momento della richiesta di servizi o che Le verranno in seguito richiesti, ovvero acquisiti da pubblici registri.
                    </p>

                    <p>
                    La invitiamo quindi a leggere con attenzione le seguenti informazioni, disponibili presso tutti i nostri Uffici e anche sul sito internet <a href="http://www.confiditrentinoimprese.it">www.confiditrentinoimprese.it</a>, prima di firmare l’allegato modulo di consenso e di barrare le ulteriori opzioni di consenso in esso riportate.
                    </p>
                    `,
            acceptButtonLabel: "Accetto"
        },
        {
            id: "13",
            title: "Iformativa Fondo di Garanzia ex legge 662/96",
            content: `
                    <h2>Cos’è la garanzia pubblica e cosa fare per ottenerla</h2>

                    <p>
                    Il <strong>Fondo di Garanzia</strong> (di seguito “il Fondo”) sostiene lo sviluppo delle micro, piccole e medie imprese Italiane concedendo una garanzia pubblica a fronte di finanziamenti concessi dalle banche.
                    </p>

                    <p>
                    La garanzia concessa dal Fondo al Confidi ed escutibile dalla banca nel caso in cui né l’impresa né il Confidi siano in grado di adempiere alle proprie obbligazioni si chiama <strong>controgaranzia</strong>. La controgaranzia consente alla banca di ponderare a zero il prestito concesso all’impresa per la parte garantita a prima richiesta dal Confidi, con notevoli vantaggi per la banca in termini di assorbimento patrimoniale e quindi di allocazione del capitale nella gestione dei rischi.
                    </p>

                    <p>
                    Rivolgendosi al Fondo, l'impresa non ottiene un contributo in denaro o l’erogazione diretta di un finanziamento agevolato, ma ha la concreta possibilità di ottenere attraverso banche, società di...
                    </p>
                    `,
            acceptButtonLabel: "Accetto"
        }
    ]
};

export default formConfig;
