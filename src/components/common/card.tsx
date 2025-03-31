type HomeCardProps = {
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

const Card = ({ className = "border-stroke-2", onClick = () => { }, children }: HomeCardProps) => {
    return (
        <section
            onClick={onClick}
            className={`bg-fill border-[1px] rounded-2xl w-full p-4 flex items-center justify-start ${className}`}>
            {children}
        </section>
    )
}

export default Card