// Toast.tsx
import React, { useEffect, useState } from 'react';
import IconCheck from '../../assets/toast/ic_check.svg?react';

export type ToastStage = 'loading' | 'success';

type ToastProps = {
    id: number | string;
    message: string;
    stage: ToastStage;
    onClose: (id: number | string) => void;
};

const Toast = ({ id, message, stage, onClose }: ToastProps) => {
    const [visible, setVisible] = useState(false);

    const [iconType, setIconType] = useState<ToastStage>(stage);
    const [iconScale, setIconScale] = useState(1);

    useEffect(() => {
        const rAF = requestAnimationFrame(() => {
            setVisible(true);
        });
        return () => cancelAnimationFrame(rAF);
    }, []);


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
            setIconScale(0);
        }
    }, [stage, iconType]);

    const handleClose = () => {
        setVisible(false);
    };

    const handleToastTransitionEnd = (
        e: React.TransitionEvent<HTMLDivElement>
    ) => {
        if ((e.propertyName === 'transform' || e.propertyName === 'opacity') && !visible) {
            onClose(id);
        }
    };
    const handleIconTransitionEnd = (
        e: React.TransitionEvent<HTMLDivElement>
    ) => {
        if (e.propertyName === 'transform') {
            if (iconScale === 0) {
                setIconType(stage);
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
        w-full
        mt-4 p-4
        rounded-lg shadow-lg text-white bg-[#0F0F0F]/90
        backdrop-blur-xs transition-all duration-300
        ${visible ? '-translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
      `}
        >
            <div className="flex flex-row items-center max-w-[400px]">
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