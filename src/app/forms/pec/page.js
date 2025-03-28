"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDownload } from '@fortawesome/free-solid-svg-icons';
import './PecPage.css';
import Button from '@/components/buttons/Button';
import Link from 'next/link';
import { useFormsContext } from '@/context/FormsContext';
import Loader from '@/components/ui/Loader';
import JSZip from 'jszip'; 
import { usePathname, useRouter } from 'next/navigation';

const getDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("docsConfidi", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "fileName" });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

const getFileFromIDB = async (fName) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const request = store.get(fName);
    request.onsuccess = (event) => {
      const result = event.target.result;
      resolve(result ? result.file : null);
    };
    request.onerror = (event) => reject(event.target.error);
  });
};

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
      // Extraer fileNames desde localStorage (serialized formData)
      const formDataStr = localStorage.getItem('formData');
      const fileNames = new Set();
      if (formDataStr) {
        const parsed = JSON.parse(formDataStr);
        const extractFileNames = (obj) => {
          if (obj && typeof obj === 'object') {
            if (obj.__isFile && obj.fileName) {
              fileNames.add(obj.fileName);
            } else if (Array.isArray(obj)) {
              obj.forEach(item => extractFileNames(item));
            } else {
              Object.values(obj).forEach(val => extractFileNames(val));
            }
          }
        };
        extractFileNames(parsed);
      }
      
      // Para cada fileName, obtener el archivo almacenado en IndexedDB
      for (const fName of fileNames) {
        try {
          const fileEntry = await getFileFromIDB(fName);
          if (fileEntry) {
            // Asegurarnos de que tenemos el Blob del archivo (contenido real)
            let fileContent;
            
            // Si es un Blob o File, usarlo directamente
            if (fileEntry instanceof Blob) {
              fileContent = fileEntry;
            } 
            // Si es un objeto serializado con datos de archivo
            else if (fileEntry.type && fileEntry.size) {
              // Intentar recuperar los datos reales del archivo
              if (fileEntry.arrayBuffer) {
                const buffer = await fileEntry.arrayBuffer();
                fileContent = new Blob([buffer], { type: fileEntry.type });
              }
            }
            
            if (fileContent) {
              zip.file(fName, fileContent);
              console.log(`Added ${fName} to ZIP`);
            } else {
              console.warn(`File ${fName} could not be added to ZIP: No valid content`);
            }
          } else {
            console.warn(`File ${fName} not found in IndexedDB`);
          }
        } catch (error) {
          console.error(`Error processing file ${fName}:`, error);
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "documenti.zip";
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
