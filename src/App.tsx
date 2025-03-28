import './App.css'

function App() {

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <h1 className='text-5xl font-bold'>Deeeply</h1>
      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Test Error");
        }}
      >
        Break the world
      </button>;
    </div>
  )
}

export default App
