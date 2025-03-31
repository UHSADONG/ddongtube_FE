type RoundButtonProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
};

const RoundButton = ({ text, onClick, disabled = false }: RoundButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                    w-fit text-text-large-bold text-white rounded-[40px] py-4 px-5
                    bg-main hover:bg-main-focus
                `}
        >
            {text}
        </button>
    );
};

export default RoundButton;