import React from 'react';

type Props = {
    id?: string;
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
};

export default function FormField({ id, label, hint, error, children }: Props) {
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="block font-medium">
                {label}
            </label>

            <div>{children}</div>

            {hint && <div className="text-sm text-gray-500">{hint}</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
    );
}
