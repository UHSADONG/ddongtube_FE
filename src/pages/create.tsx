import Button from "../components/common/button";
import Input from "../components/common/input";
import useThumbnailUpload from "../hooks/thumbnail/useThumbnailUpload";
import { useCreateForm } from "../hooks/form/useCreateForm";
import { useSubmitPlaylistForm } from '../hooks/form/useSubmitPlaylistForm';
import usePlaylistFormStore from "../hooks/store/usePlaylistForm";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import SuccessImage from "../assets/create/ic_success.webp";
import useModal from "../hooks/modal/useSuccessModal";

const Create = () => {

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

    const [Modal, isOpen, openModal, closeModal] = useModal(onCloseModal);

    const isValid = form.title.trim().length > 0 && form.description.trim().length > 0 && thumbnail;

    const { handleSubmitPlaylist } = useSubmitPlaylistForm();

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

        const result = await handleSubmitPlaylist(thumbnail, convertedPlaylistForm);
        if (result) openModal();
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
                <Button text="플레이리스트 만들기" onClick={handleSubmit} disabled={!isValid} />
            </div>
            <Modal>
                <div className="flex flex-col items-center justify-start h-full">
                    <section className="flex flex-col items-center h-full justify-between border-1">
                        <img src={SuccessImage}></img>
                        <h1 className="text-head-medium-bold text-white whitespace-pre-line text-center">{"플레이리스트가\n성공적으로 만들어졌어요!"}</h1>
                        <p className="text-text-medium-md text-font-disabled whitespace-pre-line text-center">{"24시간 동안 단 한 명도\n플레이리스트를 재생하지 않으면,\n플레이리스트는 사라져요"}</p>
                    </section>
                    <p className="text-caption-md text-font-disabled">* 한 번 사라진 플레이리스트는 복구할 수 없어요</p>
                </div>
            </Modal>
        </div>
    );
};

export default Create;