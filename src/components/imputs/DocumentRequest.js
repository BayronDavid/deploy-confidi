import React, { useRef, useState } from 'react';
import './DocumentRequest.css';
import Button from '../buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faTrash, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons';

function DocumentRequest({
    title,
    description,
    isOptional = false,
    primaryButtonLabel = 'Carica',
    skipButtonLabel = 'Salta',
    onPrimaryClick,
    onSkip,
}) {
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [skipped, setSkipped] = useState(false);
    const maxFiles = 5;

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
        let allowedFiles = files;
        if (selectedFiles.length + files.length > maxFiles) {
            allowedFiles = files.slice(0, maxFiles - selectedFiles.length);
        }
        const newFiles = [...selectedFiles, ...allowedFiles];
        setSelectedFiles(newFiles);
        setSkipped(false);
        if (typeof onPrimaryClick === 'function') {
            onPrimaryClick(newFiles);
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

    const uploadButtonLabel = (
        <span className="upload-button-content">
            <span>{primaryButtonLabel}</span>
            {/* <FontAwesomeIcon icon={faUpload} className="upload-icon" /> */}
        </span>
    );

    return (
        <div className="document-request">
            <h3 className="document-request__title">{title}</h3>
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
                                            {/* <FontAwesomeIcon icon={faTrash} /> */}
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

            {(selectedFiles.length > 0 || skipped) && (
                <div className="document-request__feedback">

                    {skipped && (
                        <div className="document-request__no-file">
                            <span className="document-request__skipped-text">
                                Doc. saltato
                            </span>
                            <span className="document-request__skipped-hint">
                                (Clicca su "{skipButtonLabel}" para cambiar)
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DocumentRequest;
