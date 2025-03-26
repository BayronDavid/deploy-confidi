"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import ModelViewer from '@/components/test_3D/ModelViewer';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function ModelDetailPage({ params }) {
    const router = useRouter();
    // Desenvolver los params con React.use()
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const [model, setModel] = useState(null);

    useEffect(() => {
        // Get models from localStorage
        const modelsStr = localStorage.getItem('models');
        if (modelsStr) {
            const models = JSON.parse(modelsStr);
            const foundModel = models.find(m => m.id === id);

            if (foundModel) {
                setModel(foundModel);
            } else {
                console.error('Model not found');
            }
        }
    }, [id]);

    const handleBack = () => {
        router.push('/test');
    };

    if (!model) {
        return (
            <div className="model-detail">
                <div className="model-detail__loader">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="model-detail">
            <button
                onClick={handleBack}
                className="model-detail__back-button"
            >
                <FontAwesomeIcon icon={faArrowLeft} /> Atras
            </button>

            <div className="model-detail__viewer">
                <ModelViewer modelPath={model.path} modelName={model.name} />
            </div>
        </div>
    );
}
