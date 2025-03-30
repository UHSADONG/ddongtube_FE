import React from 'react';

type InputProps = {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    className?: string;
    errorMessage?: string;
    isError?: boolean;
    multiline?: boolean;
};

const Input = ({
    label,
    type,
    placeholder,
    value,
    onChange,
    className = '',
    isError = false,
    errorMessage = '',
    multiline = false,
}: InputProps) => {
    const baseClass =
        'w-full px-4 outline-1 outline-stroke text-text-medium-md placeholder:text-font-disabled text-font-enabled bg-fill-2 rounded-lg focus:outline focus:outline-main caret-main transition-colors ease-in-out';

    return (
        <div className={`flex flex-col max-w-[400px] w-full ${className}`}>
            <label className="mb-2 text-sm font-medium text-white ml-1">{label}</label>

            {multiline ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={4}
                    className={`${baseClass} py-3 resize-none`}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`${baseClass} h-12`}
                />
            )}

            {isError && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </div>
    );
};

export default Input;