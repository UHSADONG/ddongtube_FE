type PlaylistDescriptionProps = {
    title: string;
    description?: string;
    isCenter?: boolean;
}

const PlaylistDescription = ({ title, description = "플레이리스트 설명", isCenter = false }: PlaylistDescriptionProps) => {
    return (
        <section className={`flex flex-1 flex-col ${isCenter ? "items-center" : "items-start"}  justify-center text-left w-full`}>
            <h1 className="text-head-medium-bold font-bold text-font-enabled ml-1 mt-5">
                {title}
            </h1>
            <p className="text-text-medium-md text-font-disabled ml-1 font-medium">{description}</p>
        </section>
    )
}

export default PlaylistDescription