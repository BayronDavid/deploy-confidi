"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ModelViewer from '@/components/test_3D/ModelViewe2x1';

export default function ModelDetailPage() {
    const router = useRouter();
    const [model, setModel] = useState({ id: 'catedral', name: 'Catedral', path: '/3D/catedral2/Test_TExturas.gltf', thumbnail: '/3D/catedral2/thumbnail.png' });

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
