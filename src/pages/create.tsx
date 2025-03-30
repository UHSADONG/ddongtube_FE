import Button from "../components/common/button";
import Input from "../components/common/input";
import useThumbnailUpload from "../hooks/thumbnail/useThumbnailUpload";
import { useCreateForm } from "../hooks/form/useCreateForm";

const Create = () => {
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

    const isValid = form.title.trim().length > 0 && form.description.trim().length > 0 && thumbnail;

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
                <Button text="플레이리스트 만들기" onClick={() => { }} disabled={!isValid} />
            </div>
        </div>
    );
};

export default Create;