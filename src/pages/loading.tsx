import LoadingImage from "@/assets/loading/ic_loading.svg?react"

type LoadingProps = {
    isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps) => {

    if (!isLoading) return null;

    return (
        <div className="h-dvh min-w-screen bg-background overflow-hidden fixed inset-0 flex flex-col items-center justify-center">
            <LoadingImage className="w-40 h-40 mt-8 animate-bounce" />
        </div>
    )
}

export default Loading