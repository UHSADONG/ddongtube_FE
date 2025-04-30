import { useState, useCallback } from 'react';
import Toast, { ToastStage } from '@/components/common/toast';

export interface IToast {
    id: number | string;
    message: string;
    stage: ToastStage;

}

export function useToast() {
    const [toasts, setToasts] = useState<IToast[]>([]);


    const hasToast = useCallback(
        (id: number | string) => {
            return toasts.some((t) => t.id === id);
        },
        [toasts]
    );

    const openLoadingToast = useCallback((message: string, customId?: number | string) => {
        const usedId = customId ?? Date.now();

        setToasts((prev) => {
            const idx = prev.findIndex((t) => t.id === usedId);
            if (idx >= 0 && prev[idx].stage !== 'loading') {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], message, stage: 'loading' };
                return updated;
            }
            return [...prev, { id: usedId, message, stage: 'loading' }];
        });

        return usedId;
    }, []);

    const openSuccessToast = useCallback((message: string, customId?: number | string) => {
        const usedId = customId ?? Date.now();

        setToasts((prev) => {
            const idx = prev.findIndex((t) => t.id === usedId);
            if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], message, stage: 'success' };
                return updated;
            }
            return [...prev, { id: usedId, message, stage: 'success' }];
        });

        return usedId;
    }, []);

    const finishToast = useCallback(
        (id?: number | string, successMessage?: string) => {
            if (!id) return;
            setToasts((prev) => {
                const idx = prev.findIndex((t) => t.id === id);
                if (idx < 0) return prev;
                const updated = [...prev];
                updated[idx] = {
                    ...updated[idx],
                    stage: 'success',
                    message: successMessage ?? updated[idx].message,
                };
                return updated;
            });
        },
        []
    );

    const removeToast = useCallback((id: number | string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const ToastPortal = (
        <>
            {toasts.map((t) => (
                <Toast
                    key={t.id}
                    id={t.id}
                    message={t.message}
                    stage={t.stage}
                    onClose={removeToast}
                />
            ))}
        </>
    );

    return {
        openLoadingToast,
        hasToast,
        openSuccessToast,
        finishToast,
        ToastPortal,
    };
}