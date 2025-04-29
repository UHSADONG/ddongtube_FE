import { useEffect } from "react";

import Button from "@/components/common/button"
import Input from "@/components/common/input"

import { ResponsiveContainer } from "@/container/responsiveContainer";

import { useStartForm } from "@/hooks/form/useStartForm";

import { removeSessionStorage } from "@/utils/sessionStorage";

import StartImage from "@/assets/start/img_start.webp"

let timeoutPromise: Promise<void> | null = null;

const Start = () => {

    if (!timeoutPromise) {
        timeoutPromise = new Promise((resolve) => {
            setTimeout(resolve, 3000);
        });
        throw timeoutPromise;
    }

    useEffect(() => {
        removeSessionStorage();
    }, []);

    const { form, errors, onChange, onSubmit } = useStartForm();

    return (
        <ResponsiveContainer>
            <img src={StartImage} className="mt-[20%] h-[100px] w-[200px]" />
            <p className="text-font-disabled text-text-medium-sm mt-2">안 들어오면.. 나.. 24시간 뒤에.. 터진다.?ㅋ</p>
            <Input
                label="닉네임"
                type="text"
                placeholder="닉네임을 입력하세요"
                value={form.nickname}
                onChange={onChange("nickname")}
                isError={!!errors.nickname}
                errorMessage={errors.nickname}
                className="mt-18 mb-8"
            />
            <Input
                label="비밀번호(선택)"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={form.password}
                onChange={onChange("password")}
                isError={!!errors.password}
                errorMessage={errors.password}
            />
            <Button text="시작하기" onClick={onSubmit} disabled={form.nickname === ""} />
        </ResponsiveContainer>
    )
}

export default Start