"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormsContext } from "@/context/FormsContext";
import FormContainer from "@/components/forms/FormContainer";
import Loader from "@/components/ui/Loader";

export default function DocumentiPage() {
  const [mergeData, setMergeData] = useState([]);
  const [docsData, setDocsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formData } = useFormsContext();

  // Extract values once, outside of render calculations
  const categoriaId = formData?.servici?.Categoria?.[0] || null;
  const servicioId = formData?.servici?.Servicio?.[0] || null;

  // 1. Data fetching effect
  useEffect(() => {
    async function fetchData() {
      try {
        const [mergeRes, docsRes] = await Promise.all([
          fetch("https://script.google.com/macros/s/AKfycbyOU9vt2SE0aSIKnBs6utNs3acH9NJllsW7bOKYsQ2vIWEAfeAbZ3J4guCbPD-yCvUg/exec?sheet=[merge][documentos]"),
          fetch("https://script.google.com/macros/s/AKfycbyOU9vt2SE0aSIKnBs6utNs3acH9NJllsW7bOKYsQ2vIWEAfeAbZ3J4guCbPD-yCvUg/exec?sheet=[documentos]")
        ]);

        const mergeJson = await mergeRes.json();
        const docsJson = await docsRes.json();

        setMergeData(mergeJson.data);
        setDocsData(docsJson.data);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. Filter merge data based on selected category and service
  const filteredMerge = useMemo(() => {
    if (!categoriaId || !servicioId) return [];
    return mergeData.filter(
      (item) =>
        item.categoria_ID === categoriaId &&
        item.servicio_ID === servicioId
    );
  }, [mergeData, categoriaId, servicioId]);

  // 3. Calculate documents and form config
  const { hasDocuments, selectedDocs, dynamicFormConfig } = useMemo(() => {
    // Check if we have any documents
    const hasDocuments = filteredMerge.length > 0;
    
    if (!hasDocuments) {
      return { hasDocuments: false, selectedDocs: [], dynamicFormConfig: null };
    }
    
    // Process document data
    const docIDs = [...new Set(filteredMerge.map(item => item.documento_ID))];
    const selectedDocs = docsData.filter(doc => docIDs.includes(doc.documento_ID));
    
    // Create form configuration
    const dynamicFormConfig = {
      groups: [
        {
          id: "documentiRichiesti",
          title: "Documenti richiesti",
          isColumn: true,
          inputs: selectedDocs.map((doc) => {
            const isRequired = doc.required === "1";
            // Crear un ID más significativo basado en el ID del documento
            // y un slug del nombre para mejor legibilidad en localStorage
            const docSlug = doc.document
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '_')
              .replace(/^_|_$/g, '');
            
            return {
              id: `doc_${doc.documento_ID}`,  // ID simple y consistente
              title: doc.document,
              description: doc.description || "",
              type: "documentRequest",
              required: isRequired,
              isOptional: !isRequired,
              primaryButtonLabel: "Carica",
              skipButtonLabel: "Salta",
              // Metadatos adicionales para referencia
              docType: docSlug,
              docId: doc.documento_ID
            };
          }),
        },
      ],
    };
    
    return { hasDocuments, selectedDocs, dynamicFormConfig };
  }, [filteredMerge, docsData]);

  // Render based on component state
  if (loading) {
    return <Loader fullScreen text="Caricamento..." />;
  }

  if (!hasDocuments) {
    return <p>Nessun documento trovato per la combinazione selezionata.</p>;
  }

  return (
    <div>
      <FormContainer formConfig={dynamicFormConfig} />
    </div>
  );
}
