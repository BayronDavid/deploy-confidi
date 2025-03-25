"use client";

import React from 'react';
import ModelGrid from '@/components/ModelGrid';
import { useRouter } from 'next/navigation';
import './style.css';

const SAMPLE_MODELS = [
    { id: 'catedral', name: 'Catedral', path: '/3D/catedral/GEO_Museo.gltf', thumbnail: '/3D/catedral/thumbnail.png' },
    { id: 'fuente', name: 'Fuente', path: '/3D/fuente/textutas/text.gltf', thumbnail: '/3D/fuente/textutas/thumbnail.jpg', hasErrors: true },
    { id: 'fuenteanim', name: 'Fuente animada', path: '/3D/fuente/anim/PoseMetalgear.gltf', thumbnail: '/3D/fuente/anim/thumbnail.png', hasErrors: true },
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