import React, { ReactNode, useCallback, useState } from "react";

export default function useModal(
    onClose?: () => void,
): [React.FC<{ children: ReactNode }>, boolean, () => void, () => void] {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        if (onClose) {
            onClose();
        }
        setIsOpen(false);
    }, []);

    const Modal = useCallback(
        ({ children }: { children: React.ReactNode }) => {
            if (!isOpen) return null;

            return (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(31,31,32,0.6)]">
                    <div className="w-full max-w-[400px] mx-6 flex flex-col bg-fill rounded-400 overflow-hidden items-center justify-center px-4 pb-7 pt-8 rounded-[20px]">
                        <div className="py-[25px]">{children}</div>
                        <button
                            onClick={close}
                            className="w-fit h-fit text-text-large-bold font-bold text-white py-3 px-6 rounded-xl bg-main hover:bg-main-focus active:bg-main-focus transition duration-200 ease-in-out"
                        >
                            확인
                        </button>
                    </div>
                </div >
            );
        },
        [isOpen, close],
    );

    return [Modal, isOpen, open, close];
}
