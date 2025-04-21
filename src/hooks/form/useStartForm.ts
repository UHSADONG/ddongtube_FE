import { useEffect, useState } from "react";
import usePlaylistFormStore from "../store/usePlaylistForm";
import { useNavigate } from "react-router";

type FormState = {
    nickname: string;
    password: string;
};

type FormErrors = {
    nickname: string;
    password: string;
};

export const useStartForm = () => {

    const navigate = useNavigate();
    
    const [form, setForm] = useState<FormState>({
        nickname: "",
        password: "",
    });

    const [errors, setErrors] = useState<FormErrors>({
        nickname: "",
        password: "",
    });

    const {setPlaylistForm} = usePlaylistFormStore();

    useEffect(()=>{
        reset();
    },[])

    const setErrorsState = (field: keyof FormErrors, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    }

    const onChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = { nickname: "", password: "" };
        const { nickname = "", password = "" } = form;

         if (!nickname.trim()) {
            newErrors.nickname = "닉네임은 필수입니다.";
        } else if (nickname.length < 2) {
            newErrors.nickname = "닉네임은 2자 이상이어야 합니다.";
        } else if (nickname.length > 20) {
            newErrors.nickname = "닉네임은 20자 이내여야 합니다.";
        }

        if (password) {
            if (password.length < 4) {
                newErrors.password = "비밀번호는 4자 이상이어야 합니다.";
            } else if (password.length > 100) {
                newErrors.password = "비밀번호는 100자 이내여야 합니다.";
            }
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => !error);
    };

    const reset = () => {
        setForm({ nickname: "", password: "" });
        setErrors({ nickname: "", password: "" });
    };

    const onSubmit = () => {
        if (!validate()) return;
        setPlaylistForm((prev) => ({
            ...prev,
            userName: form.nickname,
            userPassword: form.password,
        }));
        navigate("/create");
    };

    return {
        form,
        errors,
        onChange,
        setErrorsState,
        validate,
        onSubmit
    };
};