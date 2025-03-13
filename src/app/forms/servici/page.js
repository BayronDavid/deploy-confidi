"use client";
import OptionSelector from '@/components/imputs/OptionSelector';
import React, { useState } from 'react'

function ServiciPage() {
  const [selectedValues, setSelectedValues] = useState([]);

  const options = [
    { label: 'Impresa Individuale', value: 'impresa' },
    { label: 'Società di Persone', value: 'societa' },
    { label: 'Altra Categoria', value: 'altra' },
    { label: 'Ulteriore Opzione', value: 'ulteriore' },
  ];

  return (
    <div>
      <OptionSelector
        label="Seleziona a quale categoria appartieni"
        options={options}
        selectedValues={selectedValues}
        onChange={(newValues) => {
          console.log('Seleccionado:', newValues);
          setSelectedValues(newValues);
        }}
        allowMultiple={false}
      /* allowMultiple={true} */
      />
    </div>
  )
}

export default ServiciPage