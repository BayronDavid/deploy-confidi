import FormContainer from '@/components/forms/FormContainer'
import formConfig from '@/config/pages/Forms/dati.config'
import React from 'react'
import './DatiPage.css'

function DatiPage() {
  return (
    <div className='dati-page__container'>
      <h3>Compila i tuoi dati</h3>
      <FormContainer formConfig={formConfig} />
    </div>
  )
}

export default DatiPage