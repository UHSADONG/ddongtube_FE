type ButtonProps = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
};

const Button = ({ text, onClick, disabled = false }: ButtonProps) => {
    return (
        <div className="w-full max-w-[448px] absolute bottom-14 px-6">
            <button
                onClick={onClick}
                disabled={disabled}
                className={`
                    w-full text-text-large-bold text-white rounded-xl py-5
                    ${disabled ? 'bg-button' : 'bg-main hover:bg-main-focus'}
                    transition duration-200 ease-in-out font-bold
                `}
            >
                {text}
            </button>
        </div>
    );
};

export default Button;