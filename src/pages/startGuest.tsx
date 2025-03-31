import Button from "../components/common/button"
import Input from "../components/common/input"
import StartImage from "../assets/start/img_start.webp"
import { useStartForm } from "../hooks/form/useStartForm";
import { ResponsiveContainer } from "../container/responsiveContainer";
import { useEffect } from "react";
import { removeSessionStorage, setSessionStorage } from "../utils/sessionStorage";
import { useNavigate, useParams } from "react-router";
import ImageViewer from "../components/common/imageViewer";
import PlaylistDescription from "../components/common/playlistDescription";
import { useDebouncedMutation } from "../hooks/react-query/useDebouncedMutation";
import { postUser } from "../api/user";
import { PostUserResponse } from "../api/type/response/user";
import { ApiError } from "../error/apiError";

let timeoutPromise: Promise<void> | null = null;

const StartGuest = () => {

    const params = useParams();

    const { playlistCode } = params;

    const navigate = useNavigate();

    useEffect(() => {
        removeSessionStorage();
    }, []);

    const { form, errors, onChange } = useStartForm();

    const { mutateAsync, } = useDebouncedMutation({
        mutationFn: ({ nickname, password }: { nickname: string; password: string }) => postUser(playlistCode!, { name: nickname, password }),
        onSuccess: () => {
            console.log("성공");
        },
        onError: () => {
            console.log("실패");
        }
    }, 500, true)

    const onSubmit = async () => {
        try {
            const result = await mutateAsync({ nickname: form.nickname, password: form.password });
            setSessionStorage({
                accessToken: (result as PostUserResponse).result,
                playlistCode: playlistCode!
            })
            navigate("/home", { replace: true });
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.code === "PLAYLIST001") {
                    navigate("/error/PNF", { replace: true });
                }
                else {
                    navigate("/error", { replace: true });
                }
            }
        }
    }

    return (
        <ResponsiveContainer>
            <section key={`${playlistCode}-image`} className="flex flex-col items-start justify-center mt-[10%] w-full">
                <ImageViewer src={""} />
                <PlaylistDescription title={"CHODAEJANG"} description="플레이리스트 설명" isCenter={true} />
            </section>
            <Input
                label="닉네임"
                type="text"
                placeholder="닉네임을 입력하세요"
                value={form.nickname}
                onChange={onChange("nickname")}
                isError={!!errors.nickname}
                errorMessage={errors.nickname}
                className="mt-8 mb-8"
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
            <Button text="가입하기" onClick={onSubmit} disabled={form.nickname === ""} />
        </ResponsiveContainer>
    )
}

export default StartGuest;