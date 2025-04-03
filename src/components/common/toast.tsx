// Toast.tsx
import React, { useEffect, useState } from 'react';

type ToastProps = {
    onClose?: () => void;
};

const Toast = ({ onClose }: ToastProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    const handleClose = () => {
        setVisible(false);
    };

    const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
        if (event.propertyName === 'transform' || event.propertyName === 'opacity') {
            if (!visible && onClose) {
                onClose();
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [visible]);

    return (
        <div
            onTransitionEnd={handleTransitionEnd}
            className={`
        w-full max-w-2xl
        fixed top-0 m-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg
        transition-all duration-300 transform
        ${visible ? '-translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
      `}
        >
            <p>Toast message</p>
        </div>
    );
};

export default Toast;