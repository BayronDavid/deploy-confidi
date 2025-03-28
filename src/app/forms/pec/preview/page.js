"use client";
import React, { useEffect, useState } from 'react';
import { useFormsContext } from '@/context/FormsContext';
import Loader from '@/components/ui/Loader';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import "./preview.css"
 
const MyPdfDocument = ({ formData }) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.header}>Modulo di richiesta</Text>
      <View style={styles.section}>
        <Text>{JSON.stringify(formData, null, 2)}</Text>
      </View>
    </Page>
  </Document>
);
 
const styles = StyleSheet.create({
  body: { padding: 20 },
  header: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  section: { fontSize: 12 },
});
 
export default function PdfPreview() {
  const { formData } = useFormsContext();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const generatePdf = async () => {
      const blob = await pdf(<MyPdfDocument formData={formData} />).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoading(false);
    };
    generatePdf();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [formData]);
 
  return (
    <div className='preview-container'>
      {loading && <Loader fullScreen={false} text="Generando PDF..." />}
      {!loading && pdfUrl && (
        <iframe src={pdfUrl} style={{ width: '100%', height: '100vh', border: 'none' }} />
      )}
    </div>
  );
}
