import React, { useRef, useState } from 'react';
import './DocumentRequest.css';
import Button from '../buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';

/**
 * DocumentRequest:
 * - Muestra un título en la primera fila.
 * - En la segunda fila, a la izquierda se ubica la descripción y a la derecha dos botones:
 *   - Botón para subir el archivo (input tipo file, acepta PDF e imágenes).
 *   - Botón "No" (sólo si isOptional es true) para indicar que no se subirá documento.
 *
 * Comportamiento:
 * - Si se sube un archivo, se muestra el nombre del archivo con un botón "Eliminar" que permite quitarlo y seleccionar otro.
 * - Si se pulsa "No", el botón "No" se resalta y el botón de carga se deshabilita.
 * - Si se pulsa "No" nuevamente cuando ya está activo, se desmarca esa opción.
 *
 * Props:
 *  - title: string
 *  - description: string
 *  - isOptional: boolean (muestra el botón "No" si es true)
 *  - primaryButtonLabel: string (etiqueta del botón de carga)
 *  - skipButtonLabel: string (etiqueta del botón "No")
 *  - onPrimaryClick: callback que se invoca con el File seleccionado
 *  - onSkip: callback que se invoca al pulsar "No"
 */
function DocumentRequest({
    title,
    description,
    isOptional = false,
    primaryButtonLabel = 'Registrativo',
    skipButtonLabel = 'No',
    onPrimaryClick,
    onSkip,
}) {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [skipped, setSkipped] = useState(false);

    // Al hacer clic en el botón de carga
    const handlePrimaryButtonClick = () => {
        if (skipped) {
            setSkipped(false);
            if (typeof onSkip === 'function') {
                onSkip(false); // Notificar que se ha desmarcado la opción "No"
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Al seleccionar un archivo se actualiza el estado y se invoca el callback
    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setSkipped(false);
            if (typeof onPrimaryClick === 'function') {
                onPrimaryClick(file);
            }
        }
    };

    // Al hacer clic en "No", se alterna el estado
    const handleSkip = () => {
        const newSkippedState = !skipped;
        setSkipped(newSkippedState);
        
        // Si se marca como "No", se limpia cualquier archivo seleccionado
        if (newSkippedState) {
            setSelectedFile(null);
        }
        
        if (typeof onSkip === 'function') {
            onSkip(newSkippedState);
        }
    };

    // Permite eliminar el archivo seleccionado para poder escoger otro
    const handleRemoveFile = () => {
        setSelectedFile(null);
        // Restablecer input file para permitir seleccionar el mismo archivo nuevamente
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        
        // Notificar al componente padre que el archivo ha sido eliminado
        if (typeof onPrimaryClick === 'function') {
            onPrimaryClick(null);
        }
    };

    // Crear etiqueta personalizada con ícono para el botón de subida
    const uploadButtonLabel = (
        <span className="upload-button-content">
            <span>{primaryButtonLabel}</span>
            {/* <FontAwesomeIcon icon={faUpload} className="upload-icon" /> */}
        </span>
    );

    return (
        <div className="document-request">
            {/* Fila 1: Título */}
            <h3 className="document-request__title xxx">{title}</h3>

            {/* Fila 2: Descripción (izquierda) y botones (derecha) */}
            <div className="document-request__row">
                <p className="document-request__description ccc">{description}</p>
                <div className="document-request__actions">
                    {/* Input file oculto */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf,image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <Button
                        label={primaryButtonLabel}
                        iconUrl={"/ui/upload.svg"}
                        variant={selectedFile ? "secondary" : "primary"}
                        onClick={handlePrimaryButtonClick}
                        disabled={skipped}
                    />
                    {isOptional && (
                        <Button
                            label={skipButtonLabel}
                            variant={skipped ? "primary" : "secondary"}
                            onClick={handleSkip}
                        />
                    )}
                </div>
            </div>

            {/* Retroalimentación: se muestra si hay archivo seleccionado o se marcó "No" */}
            {(selectedFile || skipped) && (
                <div className="document-request__feedback">
                    {selectedFile && (
                        <div className="document-request__file-info">
                            <span className="document-request__file-name">
                                {selectedFile.name}
                            </span>
                            <button 
                                className="document-request__remove-icon" 
                                onClick={handleRemoveFile} 
                                aria-label="Eliminar archivo"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    )}
                    {skipped && (
                        <div className="document-request__no-file">
                            <span className="document-request__skipped-text">
                                Documento descartado
                            </span>
                            <span className="document-request__skipped-hint">
                                (Haga clic nuevamente en "{skipButtonLabel}" para cambiar esta opción)
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DocumentRequest;
