import Button from "@/components/common/button"
import Input from "@/components/common/input"
import { useStartForm } from "@/hooks/form/useStartForm";
import { ResponsiveContainer } from "@/container/responsiveContainer";
import { addSessionStorage, removeSessionStorage, setSessionStorage } from "@/utils/sessionStorage";
import { useNavigate, useParams } from "react-router";
import ImageViewer from "@/components/common/imageViewer";
import PlaylistDescription from "@/components/common/playlistDescription";
import { useDebouncedMutation } from "@/hooks/react-query/useDebouncedMutation";
import { postUser } from "@/api/user";
import { PostUserResponse } from "@/api/type/response/user";
import { ApiError } from "@/error/apiError";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPlaylistMetaPublic } from "@/api/playlist";

const StartGuest = () => {

    const params = useParams();

    const { playlistCode } = params;

    const navigate = useNavigate();

    const removeSessionStorageAsync = async () => {
        return new Promise((resolve) => {
            removeSessionStorage();
            resolve(true);
        })
    }

    const { data, isError, error } = useSuspenseQuery({
        queryKey: ["playlistMetaPublic", playlistCode],
        queryFn: async () => {
            const result = await removeSessionStorageAsync().then(() => getPlaylistMetaPublic(playlistCode!));
            return result ?? null;
        },
        retry: 1,
        staleTime: 0
    });

    const { title, thumbnailUrl, description } = data.result;
    const { form, errors, setErrorsState, onChange } = useStartForm();

    const { mutateAsync, } = useDebouncedMutation({
        mutationFn: async ({ nickname, password }: { nickname: string; password: string }) => {
            try {
                return await postUser(playlistCode!, { name: nickname, password })
            } catch (error) {
                if (error instanceof ApiError) {
                    if (error.code === "USER001") {
                        console.log(error.message);
                        setErrorsState("password", error.message);
                    }
                }
            }
        }
        ,
        onSuccess: (data) => {
            addSessionStorage("nickname", form.nickname);
            if ("result" in data) {
                addSessionStorage("isAdmin", String(data.result.isAdmin));
            }
        }
    }, 500, true)

    const onSubmit = async () => {
        try {
            const result = await mutateAsync({ nickname: form.nickname, password: form.password });
            setSessionStorage({
                accessToken: (result as PostUserResponse).result.accessToken,
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
            <meta name="og:title" content={title} />
            <meta name="og:description" content={description} />
            <meta name="og:image" content={thumbnailUrl} />
            <meta name="og:url" content={`${import.meta.env.VITE_REACT_SHARE_URL}/${playlistCode}`} />
            <meta name="og:type" content="website" />
            <meta name="og:site_name" content="딥플리" />
            <meta name="og:locale" content="ko_KR" />
            <section key={`${playlistCode}-image`} className="flex flex-col items-start justify-center mt-[10%] w-full">
                <ImageViewer src={thumbnailUrl} />
                <PlaylistDescription title={title} description={description} isCenter={true} />
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