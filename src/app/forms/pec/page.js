"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import './PecPage.css';
import Button from '@/components/buttons/Button';
import Link from 'next/link';
import { useFormsContext } from '@/context/FormsContext';
import Loader from '@/components/ui/Loader';
import JSZip from 'jszip'; // ← asegurarse de instalar jszip
import { usePathname, useRouter } from 'next/navigation';

function PecPage() {
  const router = useRouter();
  const { formData, filesStorage } = useFormsContext();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const pathname = usePathname();

  console.log("filesStorage", filesStorage);

  const downloadZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      // Recorrer filesStorage y agregar archivos que sean instancias File
      for (const key in filesStorage) {
        const fileObj = filesStorage[key];
        if (fileObj instanceof File) {
          zip.file(fileObj.name, fileObj);
        }
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "documents.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error generando el ZIP:", error);
      alert("Error generando el ZIP");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePdfGeneration = () => {
    const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    // console.log(`${normalizedPath}/pdfPreview`);
    router.push(`${normalizedPath}/preview`);
  };

  return (
    <>
      {isDownloading && <Loader fullScreen={true} text="Download in corso..." />}
      <section className="pec-page">
        <div className="pec-page__header">
          <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
          <h1 className="pec-page__title">La tua documentazione è pronta!</h1>
        </div>

        <div className="pec-page__downloads">
          <Button
            label="Cartella compressa di documenti"
            icon={<FontAwesomeIcon icon={faDownload} />}
            variant="secondary"
            onClick={downloadZip}
          />
          <Button
            label="Modulo di richiesta"
            icon={<FontAwesomeIcon icon={faDownload} />}
            variant="light"
            onClick={handlePdfGeneration}
          />
        </div>

        <div className="pec-page__back">
          <Link href="/">Torna all'inizio</Link>
        </div>

        <p className="pec-page__instructions">
          Scarica il modulo di richiesta, effettua la Firma Digitale, ed invialo
          insieme alla cartella compressa via PEC all'indirizzo{' '}
          <a href="mailto:info@cti.cn.it">info@cti.cn.it</a>.
        </p>
        <p className="pec-page__instructions">
          Uno dei nostri istruttori prenderà in carico la pratica e ti contatterà
          il prima possibile!
        </p>
      </section>
    </>
  );
}

export default PecPage;
