import Button from "../components/common/button";
import Input from "../components/common/input";
import useThumbnailUpload from "../hooks/thumbnail/useThumbnailUpload";
import { useCreateForm } from "../hooks/form/useCreateForm";
import { useSubmitPlaylistForm } from '../hooks/form/useSubmitPlaylistForm';
import usePlaylistFormStore from "../hooks/store/usePlaylistForm";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import SuccessIcon from "../assets/create/ic_success.webp";
import useModal from "../hooks/modal/useSuccessModal";

let timeoutPromise: Promise<void> | null = null;

const Create = () => {

    if (!timeoutPromise) {
        timeoutPromise = new Promise((resolve) => {
            setTimeout(resolve, 3000);
        });
        throw timeoutPromise;
    }

    const navigate = useNavigate();

    const {
        dragActive,
        thumbnail,
        thumbnailPreview,
        isConverting,
        fileInputRef,
        handleFileChange,
        handleClick,
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    } = useThumbnailUpload();

    const {
        form,
        errors,
        onChange,
    } = useCreateForm();

    const onCloseModal = () => {
        navigate("/home");
    }

    const [Modal, _, openModal] = useModal(onCloseModal);

    const isValid = form.title.trim().length > 0 && form.description.trim().length > 0 && thumbnail;

    const { handleSubmitPlaylist, isPending, isError } = useSubmitPlaylistForm();

    const { playlistForm } = usePlaylistFormStore();

    useEffect(() => {
        if (!playlistForm.userName) {
            navigate("/start")
        }
    }, [])

    const handleSubmit = async () => {

        if (!thumbnail) return;
        const convertedPlaylistForm = {
            ...playlistForm,
            playlistTitle: form.title,
            userName: playlistForm.userName || "",
            userPassword: playlistForm.userPassword || "",
        }
        try {
            const result = await handleSubmitPlaylist(thumbnail, convertedPlaylistForm);
            if (result) openModal();
        }
        catch (error) {
            console.error("Error submitting playlist:", error);
        }

    }

    const handleButtonText = () => {
        if (isPending) return "플레이리스트 생성 중...";
        if (isError) return "플레이리스트 생성 실패";
        return "플레이리스트 만들기";
    }

    return (
        <div
            className="relative h-dvh min-w-screen bg-background overflow-hidden"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {dragActive && (
                <div className="absolute inset-0 bg-black opacity-[0.66] pointer-events-none z-50" />
            )}
            <div className="flex flex-col max-w-[448px] h-dvh mx-auto items-center justify-start bg-background px-6">
                <div
                    className={`flex flex-col items-center justify-center mt-20 w-full h-[200px] border-[1px] border-dashed rounded-md bg-fill-2 ${dragActive ? "border-main" : "border-stroke"
                        }`}
                    onClick={handleClick}
                >
                    {!isConverting && thumbnailPreview ? (
                        <img
                            src={thumbnailPreview}
                            alt="Thumbnail Preview"
                            className="object-contain h-full"
                        />
                    ) : (isConverting ? (
                        <>
                            <p className="text-text-medium-md text-font-disabled">
                                파일을 변환 중입니다...
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-text-medium-md text-font-disabled">
                                플레이리스트 썸네일을
                            </p>
                            <p className="text-text-medium-md text-font-disabled">
                                선택하거나 던져주세요
                            </p>
                        </>
                    )

                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
                <Input
                    label="플레이리스트 제목"
                    type="text"
                    placeholder="플레이리스트 제목을 입력해주세요"
                    value={form.title}
                    onChange={onChange("title")}
                    isError={!!errors.title}
                    errorMessage={errors.title}
                    className="mt-7 mb-8"
                />
                <Input
                    label="플레이리스트 설명"
                    type="text"
                    placeholder="플레이리스트에 대한 설명을 입력해주세요"
                    value={form.description}
                    onChange={onChange("description")}
                    isError={!!errors.description}
                    errorMessage={errors.description}
                />
                <Button text={handleButtonText()} onClick={handleSubmit} disabled={!isValid || isPending} />
            </div>
            <Modal>
                <section className="flex flex-col items-center justify-start h-full">
                    <article className="flex flex-col items-center h-full justify-between">
                        <img src={SuccessIcon} alt="성공 아이콘"></img>
                        <h1 className="text-head-medium-bold font-bold text-white whitespace-pre-line text-center">{"플레이리스트가\n성공적으로 만들어졌어요!"}</h1>
                        <p className="text-text-medium-md text-font-disabled whitespace-pre-line text-center">{"24시간 동안 단 한 명도\n플레이리스트를 재생하지 않으면,\n플레이리스트는 사라져요"}</p>
                    </article>
                    <p className="text-caption-md text-font-disabled">* 한 번 사라진 플레이리스트는 복구할 수 없어요</p>
                </section>
            </Modal>
        </div>
    );
};

export default Create;