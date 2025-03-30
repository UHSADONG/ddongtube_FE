import React from 'react'

type InputProps = {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    errorMessage?: string;
    isError?: boolean;
}

const Input = ({
    type,
    placeholder,
    value,
    onChange,
    className = '',
    isError = false,
    errorMessage = '',
}: InputProps) => {
    return (
        <div className={`flex flex-col max-w-[400px] w-full ${className}`}>
            <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white ml-1">{placeholder}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full h-12 px-4 outline-1 outline-stroke text-text-medium-md placeholder:text-font-disabled text-font-enabled bg-fill-2 rounded-lg focus:outline focus:outline-main caret-main transition-colors ease-in-out" />
            {isError && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </div>
    )
}

export default Input;