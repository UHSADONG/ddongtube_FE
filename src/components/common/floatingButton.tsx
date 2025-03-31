type FloatingButtonProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
};

const FloatingButton = ({ text, onClick, disabled = false }: FloatingButtonProps) => {
    return (
        <div className={`
    absolute bottom-0 w-full
    bg-gradient-to-t from-black to-transparent h-1/5`}>
            <button
                onClick={onClick}
                disabled={disabled}
                className={`
                    relative left-1/2 transform -translate-x-1/2 translate-y-full bottom-4
                    w-fit text-text-large-bold text-white rounded-[40px] py-4 px-5
                    ${disabled ? 'bg-button' : 'bg-main hover:bg-main-focus'}
                    transition duration-200 ease-in-out font-bold
                `}
            >
                {text}
            </button>
        </div>
    );
};

export default FloatingButton;