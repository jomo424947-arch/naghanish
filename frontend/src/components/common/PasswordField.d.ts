import React from 'react';
import { TextFieldProps } from './TextField';
export interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
    showStrengthMeter?: boolean;
}
export declare const PasswordField: React.ForwardRefExoticComponent<PasswordFieldProps & React.RefAttributes<HTMLInputElement>>;
