import { useEffect, useState } from "react";
import { PlaylistForm } from "../types/playlist";
import usePlaylistFormStore from "./usePlaylistForm";

type FormState = {
    nickname: string;
    password: string;
};

type FormErrors = {
    nickname: string;
    password: string;
};

export const useStartForm = () => {
    
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

    const onChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = { nickname: "", password: "" };

        if (!form.nickname.trim()) {
            newErrors.nickname = "닉네임은 필수입니다.";
        }

        if (form.password && form.password.length < 4) {
            newErrors.password = "비밀번호는 4자 이상이어야 합니다.";
        }

        setErrors(newErrors);
        return !newErrors.nickname && !newErrors.password;
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
    };

    return {
        form,
        errors,
        onChange,
        validate,
        onSubmit
    };
};