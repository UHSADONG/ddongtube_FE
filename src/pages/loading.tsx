type LoadingProps = {
    isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps) => {

    if (!isLoading) return null;

    return (
        <div className="h-dvh min-w-screen bg-background overflow-hidden fixed inset-0 flex flex-col items-center justify-center">
            <img src="/loading/spinner.svg" className="w-12 h-12 mt-8 spinner" />
            <p className="text-white text-text-medium-md mt-4">로딩중입니다...</p>
        </div>
    )
}

export default Loading