import React from 'react'

type HomeCardProps = {
    user: string;
}

const HomeCard = ({ user }: HomeCardProps) => {
    return (
        <section className="bg-fill border-[1px] border-stroke rounded-2xl w-full p-4 flex items-center justify-start">
            <p className="w-full text-left text-text-medium-sm text-font-enabled font-semibold">{user}</p>
        </section>
    )
}

export default HomeCard