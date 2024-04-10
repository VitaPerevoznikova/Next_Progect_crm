'use client';
import React from 'react';
import { Field } from 'formik';

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  select?: boolean;
}

export default function InputField({
  label,
  id,
  select,
  ...rest
}: InputFieldProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="mb-2 text-base color-gray-900">
          {label}
        </label>
      )}
      {select ? (
        <Field
          as="select"
          id={id}
          {...rest}
          className="p-3 h-11 text-sm rounded border border-gray-300 shadow"
        >
          {rest.children}
        </Field>
      ) : (
        <Field
          type="text"
          id={id}
          {...rest}
          className="p-3 h-11 text-sm rounded border border-gray-300 shadow"
        />
      )}
    </div>
  );
}
