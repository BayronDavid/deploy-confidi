"use client";

import React from 'react';
import ModelGrid from '@/components/ModelGrid';
import { useRouter } from 'next/navigation';
import './style.css';

const SAMPLE_MODELS = [
    { id: '1', name: 'Catedral', path: '/3D/catedral/GEO_Museo.gltf', thumbnail: '/3D/catedral/thumbnail.png' },
    { id: '2', name: 'Estatua', path: '/3D/monolito/text.gltf', thumbnail: '/3D/monolito/thumbnail.jpg' },
    //   { id: '3', name: 'Modelo 3', path: '/models/model3.glb', thumbnail: '/thumbnails/model3.jpg' },
    //   { id: '4', name: 'Modelo 4', path: '/models/model4.glb', thumbnail: '/thumbnails/model4.jpg' },
    //   { id: '5', name: 'Modelo 5', path: '/models/model5.glb', thumbnail: '/thumbnails/model5.jpg' },
    //   { id: '6', name: 'Modelo 6', path: '/models/model6.glb', thumbnail: '/thumbnails/model6.jpg' },
];

// Store models data in localStorage for access from subpages
if (typeof window !== 'undefined') {
    localStorage.setItem('models', JSON.stringify(SAMPLE_MODELS));
}

function TestPage() {
    const router = useRouter();

    const handleSelectModel = (model) => {
        router.push(`/test/${model.id}`);
    };

    return (
        <div className="model-gallery">
            <ModelGrid
                models={SAMPLE_MODELS}
                onSelectModel={handleSelectModel}
            />
        </div>
    );
}

export default TestPage;