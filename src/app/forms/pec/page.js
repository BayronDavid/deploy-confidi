"use client";
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faDownload } from '@fortawesome/free-solid-svg-icons'
import './PecPage.css'
import Button from '@/components/buttons/Button'
import Link from 'next/link' // added import for NextJS Link

function PecPage() {
  return (
    <section className="pec-page">
      {/* Encabezado con ícono y título */}
      <div className="pec-page__header">
        <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
        <h1 className="pec-page__title">La tua documentazione è pronta!</h1>
      </div>

      {/* Botones de descarga */}
      <div className="pec-page__downloads">
        <Button 
          label="Cartella compressa di documenti" 
          icon={<FontAwesomeIcon icon={faDownload} />} 
          variant="secondary" 
        />
        <Button 
          label="Modulo di richiesta" 
          icon={<FontAwesomeIcon icon={faDownload} />} 
          variant="light" 
        />
      </div>

      {/* Botón/link para volver al inicio */}
      <div className="pec-page__back">
        <Link href="/">Torna all'inizio</Link>
      </div>

      {/* Texto de instrucciones */}
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
  )
}

export default PecPage
