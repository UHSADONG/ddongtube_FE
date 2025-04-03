
import IconShare from '../../assets/share/ic_share.svg?react'
import { PlaylistMeta } from '../../types/playlist';

type FloatingButtonProps = {
    playlistCode: string;
    playlistMeta: PlaylistMeta;
    text: string;
    onMusicButtonClick?: () => void;
    disabled?: boolean;
};


const FloatingButton = ({
    playlistCode,
    playlistMeta,
    text,
    onMusicButtonClick,
    disabled = false }: FloatingButtonProps) => {

    const onShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: `${playlistMeta.title} (광고 아님, 같이 놀고 싶은거임)`,
                text: `딥플리에서 ${window.sessionStorage.getItem("nickname") ?? playlistMeta.owner}님이 당신을 초대합니다!`,
                url: `${import.meta.env.VITE_REACT_SHARE_URL}/${playlistCode}`,
            })
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            navigator.clipboard.writeText(`https://www.deeeply.site/start/${playlistCode}`)
                .then(() => {
                    alert('공유할 수 없어, 링크가 복사되었습니다!');
                })
                .catch((error) => {
                    console.error('Error copying to clipboard:', error);
                    alert('링크 복사에 실패했습니다.');
                });

        }
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
                    ${disabled ? 'bg-button' : 'bg-main hover:bg-main-focus'}
                    transition duration-200 ease-in-out font-bold
                `}
                >
                    {text}
                </button>
                <button
                    onClick={onShareClick}
                    disabled={disabled}
                    className={`
                    w-fit text-text-large-bold text-white rounded-full py-4 px-4 bg-button
                    transition duration-200 ease-in-out font-bold
                    flex items-center justify-center flex-row space-x-1
                `}
                >
                    <p className='ml-1'>공유하기</p>
                    <IconShare className="w-5 h-5 mx-1" />
                </button>
            </div>
        </div>
    );
};

export default FloatingButton;