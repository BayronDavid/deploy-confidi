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
                // Ejemplo de un grupo habilitado
                {
                    id: "grupoMixto",
                    title: "Preferencias",
                    description: "Configure sus preferencias",
                    enabled: false,
                    inputs: [
                        {
                            id: "preferencia1",
                            type: "text",
                            label: "Preferencia 1",
                            placeholder: "Ingrese su preferencia",
                            defaultValue: "",
                            enabled: true,
                            required: true, // Este campo es requerido
                        },
                        {
                            id: "preferencia2",
                            type: "text",
                            label: "Preferencia 2 (Deshabilitada)",
                            placeholder: "Este campo está deshabilitado",
                            defaultValue: "",
                            enabled: false, // Este input no se mostrará
                            required: false,
                        }
                    ]
                },
                // Ejemplo de OptionSelector con título y descripción
                {
                    id: "tipoServicio",
                    type: "optionSelector",
                    title: "Servicios Solicitados",
                    description: "Seleccione todos los servicios que desea contratar",
                    label: "Servicios",
                    placeholder: "Seleccione los servicios",
                    enabled: false,
                    required: true,
                    allowMultiple: true,
                    options: [
                        { label: "Consultoría", value: "consultoria" },
                        { label: "Asesoría Legal", value: "legal" },
                        { label: "Asesoría Financiera", value: "financiera" },
                        { label: "Capacitación", value: "capacitacion" },
                    ],
                    defaultValue: []
                },
                // Estos grupos están deshabilitados y no afectan la validación
                {
                    id: "grupo1",
                    title: "Datos de la Empresa",
                    description: "Ingrese los datos de su empresa",
                    enabled: false,
                    inputs: [
                        {
                            id: "nombre",
                            type: "text",
                            label: "Nombre de la Empresa",
                            placeholder: "Ingrese el nombre de la empresa",
                            defaultValue: "",
                            enabled: true,
                            required: true,
                        },
                        {
                            id: "tipo",
                            type: "select",
                            label: "Tipo de Empresa",
                            placeholder: "Seleccione el tipo",
                            enabled: true,
                            required: true,
                            options: [
                                { label: "Impresa Individuale", value: "impresa" },
                                { label: "Società di Persone", value: "societa" },
                                { label: "Altra Categoria", value: "altra" },
                                { label: "Ulteriore Opzione", value: "ulteriore" },
                            ],
                        },
                    ],
                },
                {
                    id: "grupo2",
                    title: "Información de Contacto",
                    description: "Ingrese su información de contacto",
                    enabled: false,
                    inputs: [
                        {
                            id: "email",
                            type: "email",
                            label: "Correo electrónico",
                            placeholder: "Ingrese su correo",
                            defaultValue: "",
                            enabled: true,
                            required: true,
                        },
                        {
                            id: "telefono",
                            type: "tel",
                            label: "Teléfono",
                            placeholder: "Ingrese su teléfono",
                            defaultValue: "",
                            enabled: true,
                            required: false,
                            min: 0,
                            max: 9999999999,
                        },
                    ],
                },
                {
                    id: "grupoDesactivado",
                    title: "Información Adicional",
                    description: "Este grupo está desactivado",
                    enabled: false,
                    inputs: [
                        {
                            id: "comentarios",
                            type: "text",
                            label: "Comentarios",
                            placeholder: "Deje sus comentarios",
                            defaultValue: "",
                            required: false,
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
