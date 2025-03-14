"use client";

import FormContainer from "@/components/forms/FormContainer";
import { useTranslation } from "@/config/i18n";
import { formsConfig } from "@/config/pages/Forms/documenti.config";
import { useFormsContext } from "@/context/FormsContext";
import { useState, useEffect } from "react";

export default function DocumentiPage() {
  const formKey = "documentiPage";
  const { locale } = useTranslation();
  const formConfig = formsConfig[locale] && formsConfig[locale][formKey];


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { formData } = useFormsContext();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbyOU9vt2SE0aSIKnBs6utNs3acH9NJllsW7bOKYsQ2vIWEAfeAbZ3J4guCbPD-yCvUg/exec?sheet=documentale"
        );
        const jsonData = await res.json();
        console.log(jsonData.data, formData.servici);

        // Filtrar los datos que coincidan en "Categoria" y "Servicio"
        const filteredData = jsonData.data.filter((item) => {
          const matchCategoria =
            formData.servici.Categoria &&
            formData.servici.Categoria.includes(item.Categoria);
          const matchServicio =
            formData.servici.Servicio &&
            formData.servici.Servicio.includes(item.Servicio);
          const matchRequerido = item.Requerido === 1;
          return matchCategoria && matchServicio && matchRequerido;
        });

        setData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [formData]);

  if (loading) return <p>Loading...</p>;

  if (data.length === 0) {
    return <p>No se encontraron datos que coincidan.</p>;
  }

  return (
    <div>
      <FormContainer formConfig={formConfig} />
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Servicio</th>
            <th>Documento</th>
            <th>Requerido</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Categoria}</td>
              <td>{item.Servicio}</td>
              <td>{item.Documento}</td>
              <td>{item.Requerido}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
