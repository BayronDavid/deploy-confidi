export const formsConfig = {
  contactForm: {
    es: {
      title: "Formulario de contacto",
      fields: {
        name: {
          label: "Nombre",
          placeholder: "Introduce tu nombre",
          errors: {
            required: "El nombre es obligatorio",
            minLength: "El nombre debe tener al menos 2 caracteres"
          }
        },
        email: {
          label: "Correo electrónico",
          placeholder: "Introduce tu email",
          errors: {
            required: "El email es obligatorio",
            invalid: "Por favor, introduce un email válido"
          }
        },
        message: {
          label: "Mensaje",
          placeholder: "Escribe tu mensaje aquí",
          errors: {
            required: "El mensaje es obligatorio",
            minLength: "El mensaje debe tener al menos 10 caracteres"
          }
        },
        subject: {
          label: "Asunto",
          placeholder: "Asunto del mensaje",
          options: [
            { value: "general", label: "Consulta general" },
            { value: "support", label: "Soporte técnico" },
            { value: "business", label: "Oportunidades de negocio" }
          ]
        },
        terms: {
          label: "Acepto los términos y condiciones",
          error: "Debes aceptar los términos para continuar"
        }
      },
      buttons: {
        submit: "Enviar mensaje",
        cancel: "Cancelar",
        reset: "Borrar formulario"
      },
      success: "Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.",
      error: "Ha ocurrido un error al enviar tu mensaje. Por favor, inténtalo de nuevo."
    },
    en: {
      title: "Contact Form",
      fields: {
        name: {
          label: "Name",
          placeholder: "Enter your name",
          errors: {
            required: "Name is required",
            minLength: "Name must be at least 2 characters"
          }
        },
        email: {
          label: "Email",
          placeholder: "Enter your email",
          errors: {
            required: "Email is required",
            invalid: "Please enter a valid email"
          }
        },
        message: {
          label: "Message",
          placeholder: "Write your message here",
          errors: {
            required: "Message is required",
            minLength: "Message must be at least 10 characters"
          }
        },
        subject: {
          label: "Subject",
          placeholder: "Message subject",
          options: [
            { value: "general", label: "General inquiry" },
            { value: "support", label: "Technical support" },
            { value: "business", label: "Business opportunities" }
          ]
        },
        terms: {
          label: "I accept the terms and conditions",
          error: "You must accept the terms to continue"
        }
      },
      buttons: {
        submit: "Send message",
        cancel: "Cancel",
        reset: "Clear form"
      },
      success: "Your message has been sent successfully. We will contact you soon.",
      error: "An error occurred while sending your message. Please try again."
    },
    it: {
      title: "Modulo di contatto",
      fields: {
        name: {
          label: "Nome",
          placeholder: "Inserisci il tuo nome",
          errors: {
            required: "Il nome è obbligatorio",
            minLength: "Il nome deve contenere almeno 2 caratteri"
          }
        },
        email: {
          label: "Email",
          placeholder: "Inserisci la tua email",
          errors: {
            required: "L'email è obbligatoria",
            invalid: "Inserisci un'email valida"
          }
        },
        message: {
          label: "Messaggio",
          placeholder: "Scrivi qui il tuo messaggio",
          errors: {
            required: "Il messaggio è obbligatorio",
            minLength: "Il messaggio deve contenere almeno 10 caratteri"
          }
        },
        subject: {
          label: "Oggetto",
          placeholder: "Oggetto del messaggio",
          options: [
            { value: "general", label: "Richiesta generale" },
            { value: "support", label: "Supporto tecnico" },
            { value: "business", label: "Opportunità di business" }
          ]
        },
        terms: {
          label: "Accetto i termini e le condizioni",
          error: "Devi accettare i termini per continuare"
        }
      },
      buttons: {
        submit: "Invia messaggio",
        cancel: "Annulla",
        reset: "Cancella modulo"
      },
      success: "Il tuo messaggio è stato inviato con successo. Ti contatteremo presto.",
      error: "Si è verificato un errore durante l'invio del messaggio. Per favore riprova."
    }
  }
};
