"use client";

import FormContainer from '@/components/forms/FormContainer'
import formConfig from '@/config/pages/Forms/dati.config'
import React, { useEffect, useMemo, useState } from 'react'
import './DatiPage.css'
import Loader from '@/components/ui/Loader';
import { useFormsContext } from '@/context/FormsContext';

function DatiPage() {
  const [mergeData, setMergeData] = useState([]);
  const [docsData, setDocsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formData } = useFormsContext();

  // Extract values once, outside of render calculations
  const categoriaId = formData?.servici?.Categoria?.[0] || null;
  const servicioId = formData?.servici?.Servicio?.[0] || null;

  useEffect(() => {
    async function fetchData() {
      try {
        const [mergeRes, docsRes] = await Promise.all([
          fetch("https://script.google.com/macros/s/AKfycbyOU9vt2SE0aSIKnBs6utNs3acH9NJllsW7bOKYsQ2vIWEAfeAbZ3J4guCbPD-yCvUg/exec?sheet=[merge][compilativo]"),
          fetch("https://script.google.com/macros/s/AKfycbyOU9vt2SE0aSIKnBs6utNs3acH9NJllsW7bOKYsQ2vIWEAfeAbZ3J4guCbPD-yCvUg/exec?sheet=[compilativo]")
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

  const filteredMerge = useMemo(() => {
    if (!categoriaId || !servicioId) return [];
    return mergeData.filter(
      (item) =>
        item.categoria_ID === categoriaId &&
        item.servicio_ID === servicioId
    );
  }, [mergeData, categoriaId, servicioId]);

  const { hasDocuments, selectedDocs } = useMemo(() => {
    // Check if we have any documents
    const hasDocuments = filteredMerge.length > 0;

    if (!hasDocuments) {
      return { hasDocuments: false, selectedDocs: [] };
    }

    // Process document data
    const docIDs = [...new Set(filteredMerge.map(item => item.compilativo_ID))];
    const selectedDocs = docsData.filter(doc => docIDs.includes(doc.compilativo_ID));

    formConfig.groups = formConfig.groups.filter((item) => { return selectedDocs.some((doc) => doc.compilativo_ID.toString() === item.id) });

    formConfig.modals = formConfig.modals.filter((item) => { return selectedDocs.some((doc) => doc.compilativo_ID.toString() === item.id) });

    return { hasDocuments, selectedDocs };
  }, [filteredMerge, docsData]);

  // Render based on component state
  if (loading) {
    return <Loader fullScreen text="Caricamento..." />;
  }

  if (!hasDocuments) {
    return <p>Nessun documento trovato per la combinazione selezionata.</p>;
  }

  console.log({formConfig});
  

  return (
    <div className='dati-page__container'>
      <span>Compila i tuoi dati</span>
      <br />
      <br />
      <FormContainer formConfig={formConfig} />
    </div>
  )
}

export default DatiPage