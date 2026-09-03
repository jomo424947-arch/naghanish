import React from 'react';
export declare const AVATAR_OPTIONS: {
    id: string;
    name: string;
    icon: string;
    color: string;
}[];
export interface AvatarPickerProps {
    selectedAvatar: string;
    onSelectAvatar: (avatarId: string) => void;
    onCustomUpload?: (file: File) => void;
}
export declare const AvatarPicker: React.FC<AvatarPickerProps>;
