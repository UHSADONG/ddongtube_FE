
import IconShare from '@/assets/share/ic_share.svg?react'

type FloatingButtonProps = {
    playlistCode: string;
    text: string;
    openToast: (message: string) => void;
    onMusicButtonClick?: () => void;
    disabled?: boolean;
};


const FloatingButton = ({
    playlistCode,
    text,
    openToast,
    onMusicButtonClick,
    disabled = false }: FloatingButtonProps) => {

    const onShareClick = () => {
        navigator.clipboard.writeText(`https://www.deeeply.site/start/${playlistCode}`)
            .then(() => {
                openToast('플리 링크가 복사되었습니다.')
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
                alert('링크 복사에 실패했습니다.');
            });
    }

    return (
        <div className={`
    absolute bottom-0 w-full
    bg-gradient-to-t from-black to-transparent h-1/5`}>
            <div className='relative left-1/2 transform -translate-x-1/2 translate-y-full bottom-4 w-full flex justify-center space-x-4'>
                <button
                    onClick={onMusicButtonClick}
                    disabled={disabled}
                    className={`
                    w-fit text-text-large-bold text-white rounded-[40px] py-4 px-5
                    ${disabled ? 'bg-button' : 'bg-main hover:bg-main-focus action:bg-main-focus'}
                    transition duration-200 ease-in-out font-bold
                `}
                >
                    {text}
                </button>
                <button
                    onClick={onShareClick}
                    disabled={disabled}
                    className={`
                    w-fit text-text-large-bold text-white rounded-full py-4 px-4 bg-button hover:bg-button-hover active:bg-button-hover
                    transition duration-200 ease-in-out font-bold
                    flex items-center justify-center flex-row space-x-1
                `}
                >
                    <p className='ml-1'>공유하기</p>
                    <IconShare className="w-7 h-7 mx-1 pointer-events-none" />
                </button>
            </div>
        </div>
    );
};

export default FloatingButton;