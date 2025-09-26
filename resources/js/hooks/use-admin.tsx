import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { UserWithRelations } from '@/types';

interface PageProps {
    auth: {
        user: UserWithRelations | null
    };
    [key: string]: any;
}

export function useAdmin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth.user;

    useEffect(() => {
        const admin = currentUser?.roles.some(role => (role.name === 'ROLE_ADMIN'));
        setIsAdmin(!!admin);
    }, [currentUser]);

    return { isAdmin, currentUser };
}