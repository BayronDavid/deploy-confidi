'use client';

import { useTranslation } from "@/config/i18n";
import { formsConfig } from "@/config/pages/landing/forms";
import { useState } from "react";
import './ContactForm.css';

export default function ContactForm() {
  const { locale, tForm } = useTranslation();
  const formConfig = formsConfig.contactForm;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
    terms: false
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = tForm(formConfig, 'fields.name.errors', 'required');
    } else if (formData.name.length < 2) {
      newErrors.name = tForm(formConfig, 'fields.name.errors', 'minLength');
    }
    
    if (!formData.email) {
      newErrors.email = tForm(formConfig, 'fields.email.errors', 'required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = tForm(formConfig, 'fields.email.errors', 'invalid');
    }
    
    if (!formData.message) {
      newErrors.message = tForm(formConfig, 'fields.message.errors', 'required');
    } else if (formData.message.length < 10) {
      newErrors.message = tForm(formConfig, 'fields.message.errors', 'minLength');
    }
    
    if (!formData.terms) {
      newErrors.terms = tForm(formConfig, 'fields.terms', 'error');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitted(true);
    
    try {
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      // Aquí iría el código real de envío
    } catch (error) {
      setSuccess(false);
      console.error("Error submitting form:", error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Borrar error al editar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'general',
      message: '',
      terms: false
    });
    setErrors({});
    setSubmitted(false);
    setSuccess(false);
  };
  
  // Para acceder a las opciones de selección que son un array
  const getSubjectOptions = () => {
    return formConfig[locale]?.fields?.subject?.options || [];
  };
  
  return (
    <div className="contact-form-container">
      <h2>{formConfig[locale]?.title}</h2>
      
      {submitted ? (
        <div className={`result-message ${success ? 'success' : 'error'}`}>
          {success 
            ? formConfig[locale]?.success 
            : formConfig[locale]?.error}
          
          <button 
            type="button" 
            className="reset-button"
            onClick={resetForm}
          >
            {formConfig[locale]?.buttons?.reset}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">
              {formConfig[locale]?.fields?.name?.label}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={formConfig[locale]?.fields?.name?.placeholder}
              className={errors.name ? 'error-input' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              {formConfig[locale]?.fields?.email?.label}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={formConfig[locale]?.fields?.email?.placeholder}
              className={errors.email ? 'error-input' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">
              {formConfig[locale]?.fields?.subject?.label}
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
            >
              {getSubjectOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">
              {formConfig[locale]?.fields?.message?.label}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={formConfig[locale]?.fields?.message?.placeholder}
              className={errors.message ? 'error-input' : ''}
            />
            {errors.message && <span className="error-text">{errors.message}</span>}
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleInputChange}
            />
            <label htmlFor="terms">
              {formConfig[locale]?.fields?.terms?.label}
            </label>
            {errors.terms && <span className="error-text">{errors.terms}</span>}
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="submit-button">
              {formConfig[locale]?.buttons?.submit}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={resetForm}
            >
              {formConfig[locale]?.buttons?.cancel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
