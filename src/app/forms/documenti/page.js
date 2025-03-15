"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormsContext } from "@/context/FormsContext";
import FormContainer from "@/components/forms/FormContainer";
import Loader from "@/components/ui/Loader";

export default function DocumentiPage() {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { formData } = useFormsContext();

  // Se obtiene la data de la API solo una vez al montar el componente.
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbyOU9vt2SE0aSIKnBs6utNs3acH9NJllsW7bOKYsQ2vIWEAfeAbZ3J4guCbPD-yCvUg/exec?sheet=documentale"
        );
        const jsonData = await res.json();
        // Se asume que la data viene en jsonData.data
        setApiData(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Mientras se carga, se muestra el loader
  if (loading) {
    return <Loader fullScreen text="Cargando..." />;
  }

  // Se filtra la data en base a formData.servici sin volver a disparar el fetch
  const filteredData = useMemo(() => {
    if (!formData.servici) return [];
    return apiData.filter((item) => {
      const matchCategoria =
        formData.servici.Categoria &&
        formData.servici.Categoria.includes(item.Categoria);
      const matchServicio =
        formData.servici.Servicio &&
        formData.servici.Servicio.includes(item.Servicio);
      return matchCategoria && matchServicio;
    });
  }, [apiData, formData.servici]);

  if (filteredData.length === 0) {
    return <p>No se encontraron datos que coincidan.</p>;
  }

  // Se construye la configuración completa del formulario desde cero
  const dynamicFormConfig = {
    groups: [
      {
        id: "documentiRichiestiDinamico",
        title: "Documentos requeridos",
        isColumn: true,
        inputs: filteredData.map((item, index) => {
          // Por defecto, si no viene el dato, el campo es requerido.
          const isRequired = item.Requerido === 0 ? false : true;
          return {
            id: `documento_${index}`,
            title: item.Documento || "Documento",
            // La descripción queda flexible: si no viene, se deja vacía.
            description: item.Description || "",
            type: "documentRequest",
            required: isRequired,
            // Si es requerido, se desactiva la opción de omitir; sino se habilita.
            isOptional: !isRequired,
            primaryButtonLabel: "Subir documento",
            skipButtonLabel: "No",
          };
        }),
      },
    ],
  };

  return (
    <div>
      <FormContainer formConfig={dynamicFormConfig} />
    </div>
  );
}
