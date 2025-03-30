import { useState, useRef } from "react";
import heic2any from "heic2any";

const useThumbnailUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidImage = (file: File) => {
    return file.type.startsWith("image/") || file.name.toLowerCase().endsWith(".heic");
  };

  const handleFile = async (file: File) => {
    if (!isValidImage(file)) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    if (file.name.toLowerCase().endsWith(".heic")) {
      try {
        setIsConverting(true);
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });

        const convertedFile = new File(
          [convertedBlob as BlobPart],
          file.name.replace(/\.heic$/i, ".jpg"),
          { type: "image/jpeg" }
        );

        setThumbnail(convertedFile);
        setThumbnailPreview(URL.createObjectURL(convertedFile));
      } catch (error) {
        console.error("HEIC 변환 오류:", error);
        alert("HEIC 파일을 변환하는 데 실패했습니다.");
      } finally {
        setIsConverting(false);
      }
    } else {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (!dragActive) setDragActive(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return {
    dragActive,
    thumbnailPreview,
    thumbnail,
    isConverting,
    fileInputRef,
    handleClick,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
  };
};

export default useThumbnailUpload;