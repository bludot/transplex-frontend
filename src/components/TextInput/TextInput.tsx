// create text input component with tailwind css

// Path: src/components/TextInput/TextInput.tsx

// Language: typescript

import React from "react";

export interface ITextInputProps {
  ref?: React.RefObject<HTMLInputElement>
  label: string
  value?: string
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
  type?: 'text' | 'password' | 'email' | 'number'
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  required?: boolean
  autoFocus?: boolean
  autoComplete?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  readOnly?: boolean
  size?: number
  spellCheck?: boolean

  defaultValue?: string

}

export default function TextInput({
                                    ref,
                                    label,
                                    value,
                                    onChange,
                                    type = 'text',
                                    placeholder = '',
                                    className = '',
                                    style = {},
                                    disabled = false,
                                    required = false,
                                    autoFocus = false,
                                    autoComplete = false,
                                    maxLength = 0,
                                    minLength = 0,
                                    pattern = '',
                                    readOnly = false,
                                    size = 0,
                                    spellCheck = false,
                                    defaultValue = ''
                                  }: ITextInputProps) {
  console.log("VALUE", value)
  return (

    <div className={`flex flex-col ${className}`} style={style}>
      <label className="text-gray-700 text-sm font-bold mb-2" htmlFor={label}>{label}</label>
      <input
        ref={ref}
        defaultValue={defaultValue}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={label}
        type={type}
        placeholder={placeholder}

        onChange={onChange}

        required={required}
        autoFocus={autoFocus}
        autoComplete={autoComplete ? 'on' : 'off'}

        spellCheck={spellCheck}
      />
    </div>
  )

}