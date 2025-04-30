type ButtonProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
};

const Button = ({ text, onClick, disabled = false }: ButtonProps) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && onClick) {
            onClick();
        }
        e.currentTarget.blur();
    };

    return (
        <div className="w-full max-w-[448px] absolute bottom-14 px-6">
            <button
                onClick={handleClick}
                disabled={disabled}
                aria-disabled={disabled}
                className={`
                    w-full text-text-large-bold text-white rounded-xl py-5 font-bold
                    transition duration-200 ease-in-out
                    ${disabled ? 'bg-button hover:bg-button-hover active:bg-button-hover' : 'bg-main hover:shadow-glow-orange active:bg-main-focus active:shadow-glow-orange active:active-scale'}
                `}
            >
                {text}
            </button>
        </div>
    );
};

export default Button;