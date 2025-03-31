import React, { ReactNode, useCallback, useState } from "react";

export default function useAddMusicModal(
    onOpen?: () => void,
    onClose?: () => void,
): [React.FC<{ children: ReactNode }>, boolean, () => void, () => void] {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const open = useCallback(() => {
        if (onOpen) {
            onOpen();
        }
        setIsOpen(true);
    }, [onOpen]);

    const close = useCallback(() => {
        if (onClose) {
            onClose();
        }
        setIsOpen(false);
    }, [onClose]);

    const Modal = useCallback(
        ({ children }: { children: React.ReactNode }) => {
            if (!isOpen) return null;

            return (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(31,31,32,0.6)]">
                    <div className="w-full max-w-[400px] mx-6 flex flex-col bg-fill rounded-400 overflow-hidden items-center justify-center px-4 pb-7 pt-5 rounded-[20px]">
                        <div className="w-full">{children}</div>

                    </div>
                </div >
            );
        },
        [isOpen, close],
    );

    return [Modal, isOpen, open, close];
}
