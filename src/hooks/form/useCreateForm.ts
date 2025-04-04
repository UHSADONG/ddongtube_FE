import { useState } from "react";

type CreateFormState = {
  title: string;
  description: string;
};

type CreateFormErrors = {
  title: string;
  description: string;
};

export const useCreateForm = () => {
  const [form, setForm] = useState<CreateFormState>({
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState<CreateFormErrors>({
    title: "",
    description: "",
  });

  const onChange = (field: keyof CreateFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (field === "title" && value.length > 20) return;
    if (field === "description" && value.length > 100) return;

    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: CreateFormErrors = { title: "", description: "" };

    if (!form.title.trim()) {
      newErrors.title = "제목은 필수입니다.";
    }

    if (!form.description.trim()) {
      newErrors.description = "설명은 필수입니다.";
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.description;
  };

  const reset = () => {
    setForm({ title: "", description: "" });
    setErrors({ title: "", description: "" });
  };

  const isValid = form.title.trim().length > 0 && form.description.trim().length > 0;

  return {
    form,
    errors,
    onChange,
    validate,
    reset,
    isValid,
  };
};