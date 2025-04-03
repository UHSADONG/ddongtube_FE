// Toast.tsx
import React, { useEffect, useState } from 'react';
import IconCheck from '../../assets/toast/ic_check.svg?react';

export type ToastStage = 'loading' | 'success';

type ToastProps = {
    id: number | string;
    message: string;
    stage: ToastStage;
    /** 토스트 전체 Fade-Out 후 DOM 제거 요청 */
    onClose: (id: number | string) => void;
};

const Toast = ({ id, message, stage, onClose }: ToastProps) => {
    // 토스트 전체가 보이는 여부 (Fade In/Out)
    const [visible, setVisible] = useState(false);

    // 아이콘 전환용 state
    const [iconType, setIconType] = useState<ToastStage>(stage); // 현재 아이콘('loading'|'success')
    const [iconScale, setIconScale] = useState(1); // 아이콘 축소/확대(1=정상, 0=축소)

    // 1) 마운트 시점에 살짝 지연 후 Toast 전체 Fade-In
    useEffect(() => {
        const rAF = requestAnimationFrame(() => {
            setVisible(true);
        });
        return () => cancelAnimationFrame(rAF);
    }, []);

    // 2) stage===success → 2초 뒤 토스트 자동 Fade-Out
    useEffect(() => {
        if (stage === 'success') {
            const timer = setTimeout(() => {
                handleClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    useEffect(() => {
        if (stage !== iconType) {
            // 먼저 축소 (스케일 1->0)
            setIconScale(0);
        }
    }, [stage, iconType]);

    // [A] 전체 Fade-Out
    const handleClose = () => {
        setVisible(false);
    };

    // [B] 전체 Fade-Out이 끝난 시점에 onClose(id)
    const handleToastTransitionEnd = (
        e: React.TransitionEvent<HTMLDivElement>
    ) => {
        if ((e.propertyName === 'transform' || e.propertyName === 'opacity') && !visible) {
            onClose(id);
        }
    };

    // [C] 아이콘 스케일 축소(0)이 끝난 시점 → 아이콘 교체, 다시 확대(1)
    const handleIconTransitionEnd = (
        e: React.TransitionEvent<HTMLDivElement>
    ) => {
        if (e.propertyName === 'transform') {
            // 축소 완료
            if (iconScale === 0) {
                setIconType(stage);
                // 다음 프레임에 확대(0->1)
                requestAnimationFrame(() => {
                    setIconScale(1);
                });
            }
        }
    };

    return (
        <div
            onTransitionEnd={handleToastTransitionEnd}
            className={`
        fixed top-0 left-1/2 transform -translate-x-1/2
        w-full max-w-md m-4 p-4
        rounded-lg shadow-lg text-white bg-[#0F0F0F]/90
        backdrop-blur-xs transition-all duration-300
        ${visible ? '-translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
      `}
        >
            {/* 아이콘 + 텍스트 */}
            <div className="flex flex-row items-center">
                {/* 아이콘 컨테이너 (scale 애니메이션) */}
                <div
                    onTransitionEnd={handleIconTransitionEnd}
                    className="mr-2 transition-transform duration-200 origin-center"
                    style={{ transform: `scale(${iconScale})` }}
                >
                    {iconType === 'loading' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <IconCheck className="w-6 h-6" />
                    )}
                </div>
                <span className="text-sm">
                    {iconType === 'loading'
                        ? `${message}`
                        : `${message}`}
                </span>
            </div>
        </div>
    );
};

export default Toast;