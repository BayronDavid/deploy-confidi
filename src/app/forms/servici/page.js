// /pages/serviciPage.js
"use client";
import FormContainer from "@/components/forms/FormContainer";
import React from "react";
import { formsConfig } from "@/config/pages/Forms/servici.config";
import { useTranslation } from "@/config/i18n";

export default function ServiciPage() {
  const formKey = "serviciPage";
  const { locale } = useTranslation();
  const formConfig = formsConfig[locale] && formsConfig[locale][formKey];

  return <FormContainer formConfig={formConfig} />;
}
