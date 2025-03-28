"use client";

import { useState, useEffect } from "react";
import FormContainer from "@/components/forms/FormContainer";
import Loader from "@/components/ui/Loader";

export default function ServiciPage() {
  const [categorias, setCategorias] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, servRes] = await Promise.all([
          fetch("https://script.google.com/macros/s/AKfycbyOU9vt2SE0aSIKnBs6utNs3acH9NJllsW7bOKYsQ2vIWEAfeAbZ3J4guCbPD-yCvUg/exec?sheet=[categorias]"),
          fetch("https://script.google.com/macros/s/AKfycbyOU9vt2SE0aSIKnBs6utNs3acH9NJllsW7bOKYsQ2vIWEAfeAbZ3J4guCbPD-yCvUg/exec?sheet=[servicios]")
        ]);

        const catData = await catRes.json();
        const servData = await servRes.json();

        setCategorias(catData.data);
        setServicios(servData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Caricamento..." />;
  }

  const formConfig = {
    groups: [
      {
        id: "servici",
        // Se utiliza un fragmento JSX para incluir el enlace en el texto.
        description: (
          <>
            Per accedere ai nostri servizi è necessario essere socio; se non lo sei ancora{" "}
            <a href="/">clicca qui</a> e associati.
          </>
        ),
        enabled: true,
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
            id: "Categoria",
            type: "optionSelector",
            label: "Seleziona a quale categoria appartieni",
            enabled: true,
            required: true,
            allowMultiple: false,
            options: categorias.map(cat => ({
              label: cat.nombre,
              value: cat.categoria_ID,
              tooltip: cat.tooltip ?? null,
            })),
            defaultValue: []
          },
          {
            id: "Servicio",
            type: "optionSelector",
            label: "Seleziona il Servizio desiderato",
            enabled: true,
            required: true,
            allowMultiple: false,
            options: servicios.map(serv => ({
              label: serv.nombre,
              value: serv.servicio_ID,
              tooltip: serv.tooltip ?? null,
            })),
            defaultValue: []
          }
        ]
      },
    ],
  };

  return <FormContainer formConfig={formConfig} />;
}
