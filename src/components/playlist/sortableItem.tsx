import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '../common/card';
import { Video } from '@/types/video';
import IconDelete from '@/assets/playlist/ic_delete.svg?react';
import IconHamburgerDisabled from '@/assets/playlist/ic_hamburger_disabled.svg?react';

interface SortableItemProps {
    video: Video;
    index: number;
    isPlaying: boolean;
    isDeleteMode: boolean;
    openSuccessToast: (msg: string) => void;
    handleCardClick: (index: number) => void;
    handleVideoDelete: (e: React.MouseEvent<SVGSVGElement, MouseEvent>, item: Video) => void;
    disabled: boolean;
}

const SortableItem = ({
    video,
    index,
    isPlaying,
    isDeleteMode,
    openSuccessToast,
    handleCardClick,
    handleVideoDelete,
    disabled,
}: SortableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
        id: video.code,
        disabled,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        width: '100%',
    };

    const [isHamburgerActive, setIsHamburgerActive] = useState(false);
    const hamburgerColor = isHamburgerActive ? '#fff' : '#585858';

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card
                className={`playlist-card border-[1px] ${isPlaying ? 'border-main' : 'border-stroke-2'}`}
                onClick={isDeleteMode ? () => openSuccessToast('편집 중에는 영상을 변경할 수 없습니다.') : () => handleCardClick(index)}
            >
                <section className="flex flex-row items-center justify-between w-full">
                    <article className="flex flex-col items-start justify-center w-full text-left flex-1">
                        <div className="flex flex-row items-center justify-start w-full gap-2">
                            <p className={`${isPlaying ? 'text-font-enabled' : 'text-font-disabled'} text-text-medium-md font-medium`}>
                                {video.user.name}
                            </p>
                            {isPlaying && (
                                <p className={`text-text-medium-md font-semibold text-main animate-pulse`}>
                                    현재 재생 중
                                </p>
                            )}
                        </div>
                        <h1 className={`${isPlaying ? 'text-font-enabled' : 'text-font-disabled'} text-text-large-bold font-bold`}>
                            {video.title}
                        </h1>
                    </article>
                    <div className="relative w-6 h-6 overflow-hidden flex items-center">
                        <IconDelete
                            className={`
                                absolute top-0 left-0
                                ${isDeleteMode ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                            `}
                            style={{ zIndex: 2, cursor: 'pointer', pointerEvents: 'auto' }}
                            onClick={e => handleVideoDelete(e, video)}
                        />
                        <span
                            {...listeners}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 24,
                                height: 24,
                                position: 'relative',
                                cursor: 'grab',
                                touchAction: 'none',
                                zIndex: 1,
                                pointerEvents: isDeleteMode ? 'none' : 'auto',
                            }}
                        >
                            <IconHamburgerDisabled
                                className={`
                                    absolute top-0 left-0
                                    ${isDeleteMode ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
                                `}
                                color={hamburgerColor}
                                onMouseDown={() => setIsHamburgerActive(true)}
                                onMouseUp={() => setIsHamburgerActive(false)}
                                onMouseLeave={() => setIsHamburgerActive(false)}
                                onTouchStart={() => setIsHamburgerActive(true)}
                                onTouchEnd={() => setIsHamburgerActive(false)}
                            />
                        </span>
                    </div>
                </section>
            </Card>
        </div>
    );
};

export default SortableItem; 