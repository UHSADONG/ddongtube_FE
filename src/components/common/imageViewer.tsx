type ImageViewerProps = {
    src: string;
}

const ImageViewer = ({ src }: ImageViewerProps) => {
    return (
        <div
            className={`flex flex-col items-center justify-center w-full h-[200px] rounded-md bg-fill-2
                                `}
        >
            <img
                src={src}
                alt="Thumbnail Preview"
                className="object-contain h-full"
            />
        </div>
    )
}

export default ImageViewer