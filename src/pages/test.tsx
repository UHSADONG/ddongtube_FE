type Props = {}

const Test = (props: Props) => {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <h1 className='text-5xl font-bold'>Deeeply</h1>
            <button
                type="button"
                className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'
                onClick={() => {
                    throw new Error("Sentry Test Error");
                }}
            >
                Break the world
            </button>
        </div>
    )
}

export default Test