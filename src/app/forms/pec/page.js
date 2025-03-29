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
import Modal from '@/components/modal/Modal';

//
// 1. Funciones de ayuda para IndexedDB
//
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
      if (result && !result.file && (result instanceof Blob || result.type)) {
        resolve(result);
      } else {
        resolve(result ? result.file : null);
      }
    };
    request.onerror = (event) => reject(event.target.error);
  });
};

const getAllKeysFromIDB = async () => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const request = store.getAllKeys();
    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = (event) => reject(event.target.error);
  });
};

const getAllFromIDB = async () => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = (event) => reject(event.target.error);
  });
};

const findAllMatchingFiles = async (baseFileName) => {
  const allKeys = await getAllKeysFromIDB();
  
  if (allKeys.includes(baseFileName)) {
    return [baseFileName];
  }
  
  const suffixPattern = new RegExp(`^${baseFileName}_\\d+$`);
  const matchingKeys = allKeys.filter(key => suffixPattern.test(key));
  
  return matchingKeys.length > 0 ? matchingKeys : [];
};

const processFileDirectly = async (fileName) => {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("files", "readonly");
      const store = tx.objectStore("files");
      const request = store.get(fileName);
      
      request.onsuccess = (event) => {
        const result = event.target.result;
        
        if (!result) {
          return resolve(null);
        }
        
        let fileContent = null;
        
        if (result instanceof Blob) {
          fileContent = result;
        } else if (result.file && (result.file instanceof Blob || result.file.type)) {
          fileContent = result.file;
        } else if (result.type && result.size) {
          fileContent = new Blob([result.arrayBuffer || new ArrayBuffer(0)], { type: result.type });
        }
        
        resolve(fileContent);
      };
      
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    return null;
  }
};

//
// 3. Componente principal
//
function PecPage() {
  const router = useRouter();
  const { formData } = useFormsContext();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [zipSummary, setZipSummary] = React.useState([]);
  const pathname = usePathname();

  //
  // 4. Lógica para generar y descargar el ZIP
  //
  const downloadZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const formDataStr = localStorage.getItem('formData');
      const fileNames = new Set();
      const fileInfo = new Map(); // Mapa para relacionar fileName con su name original
      const addedFiles = [];
      const processedBaseNames = new Set();

      // Extraer fileNames y sus nombres originales desde localStorage
      if (formDataStr) {
        const parsed = JSON.parse(formDataStr);

        const extractFileNames = (obj) => {
          if (obj && typeof obj === 'object') {
            if (obj.__isFile && obj.fileName) {
              fileNames.add(obj.fileName);
              // Guardar la relación fileName -> name original
              fileInfo.set(obj.fileName, {
                originalName: obj.name || 'Documento sin nombre',
              });
            } else if (Array.isArray(obj)) {
              obj.forEach((item) => extractFileNames(item));
            } else {
              Object.values(obj).forEach((val) => extractFileNames(val));
            }
          }
        };

        extractFileNames(parsed);
      }
      
      const allDbKeys = await getAllKeysFromIDB();

      // Procesar cada archivo
      for (const baseName of fileNames) {
        if (processedBaseNames.has(baseName)) continue;
        processedBaseNames.add(baseName);
        
        try {
          const matchingFileNames = await findAllMatchingFiles(baseName);
          
          if (matchingFileNames.length === 0) {
            matchingFileNames.push(baseName);
          }
          
          for (const fName of matchingFileNames) {
            let fileEntry;
            
            try {
              fileEntry = await getFileFromIDB(fName);
              
              if (!fileEntry) {
                fileEntry = await processFileDirectly(fName);
              }
              
              if (!fileEntry) continue;
              
              let fileContent;
              
              if (fileEntry instanceof Blob) {
                fileContent = fileEntry;
              } else if (fileEntry.type && fileEntry.size) {
                try {
                  if (fileEntry.arrayBuffer) {
                    const buffer = await fileEntry.arrayBuffer();
                    fileContent = new Blob([buffer], { type: fileEntry.type });
                  } else {
                    fileContent = new Blob([], { type: fileEntry.type });
                  }
                } catch (bufferError) {
                  fileContent = new Blob(['%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%EOF'], { type: 'application/pdf' });
                }
              }

              if (!fileContent) continue;

              // Determinar el nombre final para el archivo en el ZIP
              let finalFileName = fName;

              if (fileContent.type) {
                const mimeToExtension = {
                  'application/pdf': '.pdf',
                  'image/jpeg': '.jpg',
                  'image/png': '.png',
                  'application/msword': '.doc',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
                  'application/vnd.ms-excel': '.xls',
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
                };

                const extensionFromMime = mimeToExtension[fileContent.type];
                const hasCorrectExtension =
                  extensionFromMime &&
                  fName.toLowerCase().endsWith(extensionFromMime.toLowerCase());

                if (extensionFromMime && !hasCorrectExtension) {
                  const baseName = fName.includes('.')
                    ? fName.substring(0, fName.lastIndexOf('.'))
                    : fName;
                  finalFileName = baseName + extensionFromMime;
                }
              }

              // Añadir el archivo al ZIP
              zip.file(finalFileName, fileContent);
              
              // Determinar la información para el resumen
              const fileData = fileInfo.get(fName) || {};
              
              addedFiles.push({
                fileName: finalFileName,
                originalName: fileData.originalName || 'Documento sin nombre',
                type: fileContent.type,
                size: Math.round(fileContent.size / 1024)
              });
            } catch (fileError) {
              console.error(`Error processing ${fName}:`, fileError);
            }
          }
        } catch (error) {
          console.error(`Error procesando el archivo ${baseName}:`, error);
        }
      }

      // Generar y descargar el ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documenti.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Mostrar el resumen
      setZipSummary(addedFiles);
      setShowModal(true);
    } catch (error) {
      console.error("Error generando el ZIP:", error);
      alert("Error generando el ZIP");
    } finally {
      setIsDownloading(false);
    }
  };

  //
  // 5. Navegación a la vista de PDF
  //
  const handlePdfGeneration = () => {
    const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    router.push(`${normalizedPath}/preview`);
  };

  //
  // 6. Render del componente
  //
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Riepilogo documenti compressi"
      >
        <div className="zip-summary">
          <p>Hai scaricato un archivio ZIP contenente i seguenti documenti:</p>
          <div className="zip-file-table-container">
            <div className="zip-file-table">
              {/* Primera columna: Nombres originales */}
              <div className="zip-file-column">
                <div className="column-header">Nome originale</div>
                <div className="column-cells">
                  {zipSummary.map((file, index) => (
                    <div key={`orig-${index}`} className="column-cell">
                      {file.originalName}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Segunda columna: Nombres de archivo */}
              <div className="zip-file-column">
                <div className="column-header">Nome del file</div>
                <div className="column-cells">
                  {zipSummary.map((file, index) => (
                    <div key={`file-${index}`} className="column-cell">
                      {file.fileName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="zip-total">Totale documenti: {zipSummary.length}</p>
        </div>
      </Modal>
    </>
  );
}

export default PecPage;
