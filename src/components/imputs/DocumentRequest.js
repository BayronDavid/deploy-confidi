import React, { useRef, useState, useEffect } from 'react';
import './DocumentRequest.css';
import Button from '../buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faTrash, faUpload, faXmark, faExclamationCircle, faQuestionCircle, faDownload, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useFormsContext } from '@/context/FormsContext';
import Modal from '../modal/Modal';

function DocumentRequest({
    title,
    description,
    isOptional = false,
    primaryButtonLabel = 'Carica',
    skipButtonLabel = 'Salta',
    onPrimaryClick,
    onSkip,
    value,
    tooltip,
    tc
}) {
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [skipped, setSkipped] = useState(false);
    const [hasAction, setHasAction] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const maxFiles = 5;
    const { getFileFromStorage, formSubmitAttempted } = useFormsContext();

    //verificar si un valor es un archivo válido
    const isValidFileValue = (val) => {
        if (!val) return false;
        // Si es un objeto vacío, lo consideramos inválido
        if (typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length === 0) return false;

        if (val instanceof File) return true;

        if (Array.isArray(val)) {
            return val.some(item => item instanceof File || (item && typeof item === 'object' && item.__isFile));
        }

        return val && typeof val === 'object' && val.__isFile;
    };


    // Inicializar estado basado en el valor recibido - Mejorado para manejar datos deserializados
    useEffect(() => {
        if (value) {
            if (value === "skipped") {
                setSkipped(true);
                setSelectedFiles([]);
                setHasAction(true);
            } else if (isValidFileValue(value)) {
                if (Array.isArray(value)) {
                    // Array de archivos
                    const validFiles = value.filter(item => isValidFileValue(item));
                    setSelectedFiles(validFiles);
                    setSkipped(false);
                    setHasAction(validFiles.length > 0);
                } else {
                    // Archivo individual
                    setSelectedFiles([value]);
                    setSkipped(false);
                    setHasAction(true);
                }
            } else {
                // Valor no reconocido como válido
                setSelectedFiles([]);
                setSkipped(false);
                setHasAction(false);
            }
        } else {
            // Sin valor
            setSelectedFiles([]);
            setSkipped(false);
            setHasAction(false);
        }
    }, [value]);

    // Al hacer clic en el botón de carga, se abre el input file.
    const handlePrimaryButtonClick = () => {
        if (skipped) {
            setSkipped(false);
            if (typeof onSkip === 'function') {
                onSkip(false);
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Al seleccionar archivos, se agrega hasta alcanzar el máximo permitido.
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        let allowedFiles = files;
        if (selectedFiles.length + files.length > maxFiles) {
            allowedFiles = files.slice(0, maxFiles - selectedFiles.length);
        }

        const newFiles = [...selectedFiles, ...allowedFiles];
        setSelectedFiles(newFiles);
        setSkipped(false);

        if (typeof onPrimaryClick === 'function') {
            // Si solo permitimos un archivo, enviamos solo el primero
            onPrimaryClick(newFiles.length === 1 ? newFiles[0] : newFiles);
            setHasAction(true);
        }
    };

    // Alterna la opción "No". Si se activa, limpia los archivos seleccionados.
    const handleSkip = () => {
        const newSkippedState = !skipped;
        setSkipped(newSkippedState);
        if (newSkippedState) {
            setSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
        if (typeof onSkip === 'function') {
            onSkip(newSkippedState);
            setHasAction(true);
        }
    };

    // Permite eliminar un archivo individual de la lista.
    const handleRemoveFile = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        if (typeof onPrimaryClick === 'function') {
            onPrimaryClick(updatedFiles);
        }
    };

    // Nuevo manejador para abrir/cerrar el tooltip modal
    const handleTooltipToggle = () => {
        setIsTooltipOpen(!isTooltipOpen);
    };

    return (
        <div className={`document-request ${isOptional && !hasAction && formSubmitAttempted ? 'document-request--pending-action' : ''}`}>
            <h3 className="document-request__title">
                {title}
                {tooltip && (
                    <span className="document-request__tooltip-icon" onClick={handleTooltipToggle}>
                        <FontAwesomeIcon icon={faQuestionCircle} />
                    </span>
                )}
            </h3>
            <div className="document-request__row">
                <p className="document-request__description">{description}</p>
                <div className="document-request__actions">
                    <div className="document-request__actions-uploaded-files">
                        {selectedFiles.length > 0 && (
                            <div className="document-request__files-list">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="document-request__file-info">
                                        <span className="document-request__file-name" title={file.name}>
                                            <FontAwesomeIcon icon={faFile} />
                                            <span className="document-request__file-text">{file.name}</span>
                                        </span>
                                        <button
                                            className="document-request__remove-icon"
                                            onClick={() => handleRemoveFile(index)}
                                            aria-label="Eliminar archivo"
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="document-request__actions-buttons">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf,image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            multiple
                        />
                        <Button
                            label={primaryButtonLabel}
                            iconUrl={"/ui/upload.svg"}
                            variant={"primary"}
                            onClick={handlePrimaryButtonClick}
                            disabled={skipped || selectedFiles.length >= maxFiles}
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
            </div>

            {/* Solo mostrar advertencia después de un intento de envío */}
            {!hasAction && formSubmitAttempted && (
                <div className="document-request__warning">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {isOptional ? (
                        <span>È necessario caricare un documento o fare clic su "{skipButtonLabel}"</span>
                    ) : (
                        <span>È necessario caricare un documento</span>
                    )}
                </div>
            )}

            {/* Modal para el tooltip */}
            {tooltip && (
                <Modal
                    isOpen={isTooltipOpen}
                    onClose={() => setIsTooltipOpen(false)}
                    title={title}
                >
                    <div>{tooltip}</div>
                    {tc && (

                        <div className="document-request__modal_download_tc">
                            <a href={tc} target='_blank' >Scarica T&C <FontAwesomeIcon icon={faDownload} size='1x' /></a>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
}

export default DocumentRequest;
