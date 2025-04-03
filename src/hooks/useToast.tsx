// useToast.ts
import { useState, useCallback, useEffect } from 'react';
import Toast, { ToastStage } from '../components/common/toast';

/** 하나의 Toast를 나타내는 데이터 구조 */
export interface IToast {
    id: number | string;
    message: string;
    stage: ToastStage; // 'loading' | 'success'

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

    /**
     * Fade-Out이 끝난 토스트를 배열에서 제거 (Toast 컴포넌트 -> onClose -> removeToast)
     */
    const removeToast = useCallback((id: number | string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // 여러 Toast를 렌더
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