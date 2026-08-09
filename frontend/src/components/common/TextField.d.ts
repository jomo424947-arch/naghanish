import React from 'react';
import { InputProps } from './Input';
export interface TextFieldProps extends InputProps {
    label?: string;
    helperText?: string;
    errorMessage?: string;
    required?: boolean;
}
export declare const TextField: React.ForwardRefExoticComponent<TextFieldProps & React.RefAttributes<HTMLInputElement>>;
