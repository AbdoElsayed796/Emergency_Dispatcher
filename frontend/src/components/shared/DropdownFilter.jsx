import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function DropdownFilter({
                            value,
                            onChange,
                            options = [],
                            placeholder = "Select...",
                            label = "",
                            className = ""
                        }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
            >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        <button
                            onClick={() => {
                                onChange(placeholder);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-gray-100 text-gray-500"
                        >
                            {placeholder}
                        </button>
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-green-50 text-gray-900"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
export default DropdownFilter;