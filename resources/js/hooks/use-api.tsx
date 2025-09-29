// hooks/useApi.js
import { router } from '@inertiajs/react';
import { useCallback } from 'react';

export const useApi = () => {

    const apiRequest = useCallback(
        async (url: string, options: { headers?: Record<string, string> } = {}) => {
            const response = await fetch(url, {
                ...options,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (response.status === 403) {
                router.visit('/unauthorized');
                throw new Error('Accès refusé');
            }

            return await response.json();

        },
        [],
    );

    return { apiRequest };
};
