import { usePage } from '@inertiajs/react';

interface FlashMessages {
    success?: string;
    error?: string;
    message?: string;
    info?: string;
    warning?: string;
}

export function useFlashMessages() {
    const { flash } = usePage<{ flash: FlashMessages }>().props;
    return {
        success: flash?.success,
        error: flash?.error,
        message: flash?.message,
        info: flash?.info,
        warning: flash?.warning,
    };
}