import React from 'react';
import Button from './Button';

/**
 * Componente de demostración que muestra todas las variantes de botones disponibles
 */
function ButtonExamples() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Biblioteca de Botones</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Variantes Principales</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button label="Primary (Rosa)" variant="primary" />
          <Button label="Secondary (Negro)" variant="secondary" />
          <Button label="Secondary Fancy" variant="secondary-fancy" />
          <Button label="Gray" variant="gray" />
          <Button label="Disabled" disabled />
        </div>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Otros Colores</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button label="Outline" variant="outline" />
          <Button label="Blue" variant="blue" />
          <Button label="Yellow" variant="yellow" />
          <Button label="Green" variant="green" />
        </div>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Tamaños</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button label="Small" size="small" variant="primary" />
          <Button label="Default" variant="primary" />
          <Button label="Large" size="large" variant="primary" />
        </div>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Con Enlaces</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button label="Enlace Interno" url="/ruta-interna" variant="primary" />
          <Button label="Enlace Externo" url="https://google.com" variant="secondary" target="_blank" />
        </div>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Con Tooltips</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button 
            label="Con Tooltip" 
            variant="primary"
            tooltipTitle="Información Importante"
          >
            <p>Este botón tiene información adicional que puedes ver en este tooltip.</p>
            <p>Es útil para explicar funcionalidades complejas.</p>
          </Button>
          
          <Button 
            label="Ayuda" 
            variant="outline"
            tooltipTitle="Instrucciones"
          >
            <p>Sigue estos pasos para completar el proceso:</p>
            <ol>
              <li>Completa el formulario</li>
              <li>Verifica tus datos</li>
              <li>Envía la solicitud</li>
            </ol>
          </Button>
        </div>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Efectos Especiales</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button label="Con Efecto Pulso" variant="primary" pulse />
          <Button label="Con Ancho Fijo" variant="secondary" width="200px" />
        </div>
      </section>
    </div>
  );
}

export default ButtonExamples;
