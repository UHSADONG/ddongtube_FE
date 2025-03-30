import Button from "../components/common/button"
import Input from "../components/common/input"
import StartImage from "../assets/start/img_start.webp"
import { useStartForm } from "../hooks/useStartForm";

const Start = () => {

    const { form, errors, onChange, onSubmit } = useStartForm();

    return (
        <div className="h-dvh min-w-screen bg-background overflow-hidden">
            <div className="flex flex-col max-w-2xl h-dvh mx-auto items-center justify-start bg-background px-6">
                <img src={StartImage} className="mt-[120px]" />
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
            </div>
        </div>
    )
}

export default Start