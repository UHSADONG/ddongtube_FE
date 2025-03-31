type HomeCardProps = {
    children?: React.ReactNode;
}

const Card = ({ children }: HomeCardProps) => {
    return (
        <section className="bg-fill border-[1px] border-stroke-2 rounded-2xl w-full p-4 flex items-center justify-start">
            {children}
        </section>
    )
}

export default Card