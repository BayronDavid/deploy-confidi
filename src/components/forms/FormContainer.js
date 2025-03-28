"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormsContext } from "@/context/FormsContext";
import FormGroup from "./FormGroup";
import useHasMounted from "@/hooks/useHasMounted";
import FormInput from "./FormInput";
import Accordion from "../Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import HtmlRenderer from "@/utils/HtmlRenderer";
import Modal from "../modal/Modal";
import Button from "../buttons/Button";

function isValidFile(value) {
  if (!value) return false;
  if (value instanceof File) return true;
  if (Array.isArray(value)) return value.some(item => item instanceof File || (item && typeof item === "object" && item.__isFile));
  return value && typeof value === "object" && value.__isFile;
}

function validateDocumentRequest(value, isOptional) {
  if (isOptional && value === "skipped") return true;
  if (!isOptional && value === "skipped") return false;
  return isValidFile(value);
}

function validateInput(groupData, input) {
  if (input.enabled === false) return true;
  const value = groupData[input.id];
  if (input.type === "documentRequest") return validateDocumentRequest(value, input.isOptional);
  if (input.type === "optionSelector") return input.required ? Array.isArray(value) && value.length > 0 : true;
  return input.required ? Boolean(value && value !== "") : true;
}

function validateSubGroup(subGroupData, subGroup) {
  if (subGroup.enabled === false) return true;
  return subGroup.inputs.every(input => validateInput(subGroupData || {}, input));
}

function FormContainer({ formConfig }) {
  const hasMounted = useHasMounted();
  const initialValidationDone = useRef(false);
  const formRef = useRef(null);
  const [currentModalIndex, setCurrentModalIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalsAccepted, setModalsAccepted] = useState(false);
  const router = useRouter();
  const { formData, updateFormData, setIsCurrentFormValid, setSubmitCurrentForm, setFormRef, duplicateGroup, currentStep, getRouteForStep } = useFormsContext();

  useEffect(() => {
    setIsCurrentFormValid(false);
    if (formRef.current) setFormRef(formRef);
  }, []);

  useEffect(() => {
    if (!formConfig || !formConfig.groups || !hasMounted || initialValidationDone.current) return;
    let formIsValid = true;
    for (const group of formConfig.groups) {
      if (group.enabled === false) continue;
      if (group.repeatable) {
        const groupInstances = Array.isArray(formData[group.id])
          ? formData[group.id]
          : formData[group.id] ? [formData[group.id]] : [];
        if (group.required && groupInstances.length === 0) {
          formIsValid = false;
          break;
        }
        for (const instance of groupInstances) {
          if (group.subGroups) {
            for (const subGroup of group.subGroups) {
              if (!validateSubGroup(instance[subGroup.id], subGroup)) formIsValid = false;
            }
          } else if (group.inputs) {
            for (const input of group.inputs) if (!validateInput(instance, input)) formIsValid = false;
          }
          if (!formIsValid) break;
        }
      } else if (group.subGroups) {
        const groupData = formData[group.id] || {};
        for (const subGroup of group.subGroups) {
          if (!validateSubGroup(groupData[subGroup.id], subGroup)) formIsValid = false;
        }
      } else if (group.inputs) {
        const groupData = formData[group.id] || {};
        for (const input of group.inputs) if (!validateInput(groupData, input)) formIsValid = false;
      } else if (!validateInput(formData, group)) {
        formIsValid = false;
      }
      if (!formIsValid) break;
    }
    setIsCurrentFormValid(formIsValid);
    initialValidationDone.current = true;
  }, [formConfig, formData, hasMounted, setIsCurrentFormValid]);

  useEffect(() => {
    if (!formConfig || !formConfig.groups) {
      setIsCurrentFormValid(false);
      return;
    }
    let formIsValid = true;
    for (const group of formConfig.groups) {
      if (group.enabled === false) continue;
      if (group.repeatable) {
        const groupInstances = Array.isArray(formData[group.id])
          ? formData[group.id]
          : formData[group.id] ? [formData[group.id]] : [];
        if (group.required && groupInstances.length === 0) {
          formIsValid = false;
          break;
        }
        for (const instance of groupInstances) {
          if (group.subGroups) {
            for (const subGroup of group.subGroups) {
              if (!validateSubGroup(instance[subGroup.id], subGroup)) formIsValid = false;
            }
          } else if (group.inputs) {
            for (const input of group.inputs) if (!validateInput(instance, input)) formIsValid = false;
          }
          if (!formIsValid) break;
        }
      } else if (group.subGroups) {
        const groupData = formData[group.id] || {};
        for (const subGroup of group.subGroups) {
          if (!validateSubGroup(groupData[subGroup.id], subGroup)) formIsValid = false;
        }
      } else if (group.inputs) {
        const groupData = formData[group.id] || {};
        for (const input of group.inputs) if (!validateInput(groupData, input)) formIsValid = false;
      } else if (!validateInput(formData, group)) {
        formIsValid = false;
      }
      if (!formIsValid) break;
    }
    setIsCurrentFormValid(formIsValid);
  }, [formData, formConfig, setIsCurrentFormValid]);

  const handleSubmit = () => {
    if (!formConfig) return false;
    let nativeValidationPassed = true;
    if (formRef.current) nativeValidationPassed = formRef.current.checkValidity();
    let isFormValid = true;
    for (const group of formConfig.groups) {
      if (group.enabled === false) continue;
      if (group.inputs) {
        const groupData = formData[group.id] || {};
        for (const input of group.inputs) {
          if (!validateInput(groupData, input)) {
            isFormValid = false;
            break;
          }
        }
      } else if (!validateInput(formData, group)) {
        isFormValid = false;
      }
      if (!isFormValid) break;
    }
    if (nativeValidationPassed && isFormValid) {
      if (formConfig.modals && formConfig.modals.length > 0 && !modalsAccepted) {
        setCurrentModalIndex(0);
        setModalOpen(true);
        return false;
      }
      return true;
    }
    return false;
  };

  const submitFinalForm = () => {
    console.log("Submitting final form with data:", formData);
  };

  const handleAcceptModal = () => {
    setModalOpen(false);
  };

  const handleModalExited = () => {
    if (formConfig.modals && currentModalIndex < formConfig.modals.length - 1) {
      setCurrentModalIndex(currentModalIndex + 1);
      setModalOpen(true);
    } else {
      setModalsAccepted(true);
      setCurrentModalIndex(null);
      submitFinalForm();
      router.push(getRouteForStep(currentStep + 1));
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setSubmitCurrentForm(() => handleSubmit);
    return () => setSubmitCurrentForm(() => () => false);
  }, [setSubmitCurrentForm, formConfig, formData]);

  const handleDuplicateGroup = (groupId) => {
    const groupExists = formData && groupId in formData;
    if (!groupExists) {
      updateFormData(groupId, []);
      setTimeout(() => {
        duplicateGroup(groupId);
        setTimeout(() => scrollToLastInstance(groupId), 100);
      }, 10);
    } else {
      duplicateGroup(groupId);
      setTimeout(() => scrollToLastInstance(groupId), 100);
    }
  };

  const scrollToLastInstance = (groupId) => {
    const instances = document.querySelectorAll(`[data-group-id="${groupId}"].repeatable-instance`);
    if (instances.length > 0) {
      const lastInstance = instances[instances.length - 1];
      const scrollContainer = document.querySelector('.forms-content');
      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const instanceRect = lastInstance.getBoundingClientRect();
        scrollContainer.scrollTo({
          top: scrollContainer.scrollTop + (instanceRect.top - containerRect.top) - 20,
          behavior: 'smooth'
        });
        lastInstance.classList.add('highlight-new-instance');
        setTimeout(() => lastInstance.classList.remove('highlight-new-instance'), 2000);
      } else {
        lastInstance.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (!hasMounted || !formConfig || !formConfig.groups) return null;
  return (
    <>
      <form ref={formRef} onSubmit={onFormSubmit} noValidate={false} className="form-container">
        {formConfig.title && <h1>{formConfig.title}</h1>}
        {formConfig.description && <p>{HtmlRenderer(formConfig.description)}</p>}
        {formConfig.groups.map(group => {
          if (group.enabled === false) return null;
          if (group.repeatable) {
            let groupInstances = formData[group.id]
              ? Array.isArray(formData[group.id]) ? formData[group.id] : [formData[group.id]]
              : [{ _id: Date.now() + Math.floor(Math.random() * 1000) }];
            if (groupInstances.length === 0) groupInstances.push({ _id: Date.now() + Math.floor(Math.random() * 1000) });
            groupInstances.forEach((instance, idx) => { if (!instance._id) instance._id = Date.now() + idx + Math.floor(Math.random() * 1000); });
            if (group.isAccordion) {
              return (
                <Accordion key={group.id} title={group.accordionTitle || group.title || "Sección"} defaultOpen={group.defaultOpen}>
                  <div className="repeatable-group-container">
                    {group.description && <p>{HtmlRenderer(group.description)}</p>}
                    {groupInstances.map((instance, index) => (
                      <FormGroup key={instance._id || index} group={group} groupData={instance} isInAccordion={true} isRepeatable={true}
                        instanceIndex={index} canDelete={index > 0} data-group-id={group.id} />
                    ))}
                    <button type="button" className="add-group-btn" onClick={() => handleDuplicateGroup(group.id)}>
                      <FontAwesomeIcon icon={faPlus} /> Aggiungi {group.accordionTitle || group.title || "Sezione"}
                    </button>
                  </div>
                </Accordion>
              );
            }
            return (
              <div key={group.id} className="repeatable-group-container">
                {groupInstances.map((instance, index) => (
                  <FormGroup key={instance._id || index} group={group} groupData={instance} isRepeatable={true}
                    instanceIndex={index} canDelete={index > 0} data-group-id={group.id} />
                ))}
                <button type="button" className="add-group-btn" onClick={() => handleDuplicateGroup(group.id)}>
                  <FontAwesomeIcon icon={faPlus} /> Aggiungi {group.title || "Sezione"}
                </button>
              </div>
            );
          }
          if (group.isAccordion) {
            return (
              <Accordion key={group.id} title={group.accordionTitle || group.title || "Sección"} defaultOpen={group.defaultOpen}>
                {group.description && <p>{HtmlRenderer(group.description)}</p>}
                {group.subGroups ? (
                  <div>
                    {group.subGroups.map(subGroup => (
                      <FormGroup key={subGroup.id} group={subGroup} groupData={formData[group.id]?.[subGroup.id]}
                        isInAccordion={true} parentGroupId={group.id} />
                    ))}
                  </div>
                ) : group.inputs ? (
                  <FormGroup group={group} groupData={formData[group.id]} isInAccordion={true} />
                ) : (
                  <div>
                    <FormInput config={group} value={formData[group.id]} onChange={(value) => updateFormData(group.id, value)} />
                  </div>
                )}
              </Accordion>
            );
          }
          if (group.subGroups) {
            return (
              <div key={group.id}>
                {group.title && <h2>{group.title}</h2>}
                {group.description && <p>{HtmlRenderer(group.description)}</p>}
                {group.subGroups.map(subGroup => (
                  <FormGroup key={subGroup.id} group={subGroup} groupData={formData[group.id]?.[subGroup.id]} parentGroupId={group.id} />
                ))}
              </div>
            );
          }
          if (group.inputs) {
            return <FormGroup key={group.id} group={group} groupData={formData[group.id] || {}} />;
          }
          return (
            <div key={group.id}>
              <FormInput config={group} value={formData[group.id]} onChange={(value) => updateFormData(group.id, value)} />
            </div>
          );
        })}
      </form>
      {currentModalIndex !== null && formConfig.modals && (
        <Modal
          isOpen={modalOpen}
          onClose={() => {}}  // no-op to disallow closing the modal by clicking X or outside
          onExited={handleModalExited}
          title={formConfig.modals[currentModalIndex].title}
        >
          <div className="flex-column-center">
            <div className="modal-content-text">
              {HtmlRenderer(formConfig.modals[currentModalIndex].content)}
            </div>
            <Button
              label={
                `${formConfig.modals[currentModalIndex].acceptButtonLabel || "Accetto"} ` +
                `(${currentModalIndex + 1}/${formConfig.modals.length})`
              }
              onClick={handleAcceptModal}
            />
          </div>
        </Modal>
      )}
    </>
  );
}

export default FormContainer;
