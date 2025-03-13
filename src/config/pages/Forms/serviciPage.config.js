// /config/forms.config.js
export const formsConfig = {
    es: {
        serviciPage: {
            title: "Formulario de Servicios",
            description: "Complete la siguiente información",
            groups: [
                {
                    id: "tipo",
                    type: "optionSelector",  // Nota: el type coincide con el case en FormInput
                    label: "Tipo de Empresa",
                    placeholder: "Seleccione el tipo",
                    enabled: true,
                    required: true,
                    allowMultiple: false,  // Esto es para controlar el modo (radio vs checkbox)
                    options: [
                        { label: "Impresa Individuale", value: "impresa" },
                        { label: "Società di Persone", value: "societa" },
                        { label: "Altra Categoria", value: "altra" },
                        { label: "Ulteriore Opzione", value: "ulteriore" },
                    ],
                    defaultValue: []  // Para OptionSelector, el default suele ser un array vacío
                },
                {
                    id: "grupo1",
                    title: "Datos de la Empresa",
                    description: "Ingrese los datos de su empresa",
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
            ],
            onSubmit: (formData) => {
                // Aquí se manejaría el envío del formulario (por ejemplo, llamar a una API)
                console.log("Formulario enviado", formData);
            },
        },
    },
    en: {
        // Listo para usar
    },
    it: {
        // Listo para usar
    },
};
