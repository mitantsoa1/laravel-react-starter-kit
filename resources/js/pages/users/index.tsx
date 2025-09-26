import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DataTable } from "./data-table"
import { router, usePage } from '@inertiajs/react'
import Swal from 'sweetalert2'
import axios from 'axios'
import AppLayout from '@/layouts/app-layout'
import { Role, UserWithRelations } from '@/types'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/hooks/use-admin'

interface PageProps {
    auth: {
        user: UserWithRelations | null
    };
    [key: string]: any;
}

interface UsersListProps {
    users: UserWithRelations[]
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
    const { isAdmin, currentUser: user } = useAdmin();

    const handleEdit = (id: number) => {
        router.get(`/users/${id}/edit`);
    }
    const handleDelete = (id: number) => {
        // router.get(`/users/${id}/edit`);
        Swal.fire({
            title: "Do you want to delete this user?",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#111",
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const response = await axios.delete(`/users/${id}`);
                if (response && response.data.status === 'success') {
                    Swal.fire("Deleted!", "", "success");
                } else {
                    Swal.fire("Error!", "", "error");
                }
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
            router.reload()
        });
    }

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "roles",
            header: "Roles",
            cell: (value: any) => {
                return (
                    <div className="flex flex-wrap justify-center gap-1">
                        {value?.map((role: Role) => (
                            <Badge
                                key={role.id}
                                variant="outline"
                                className="capitalize border-green-500 rounded-lg p-1"
                            >
                                {role.name}
                            </Badge>
                        ))}
                    </div>
                )
            },
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            accessorKey: "id",
            header: "Actions",
            cell: (value: number) => (
                <div className="flex justify-center gap-2">
                    {(isAdmin || user?.id == value) && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white cursor-pointer"
                            onClick={() => {
                                handleEdit(value)
                            }
                            }
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                    {isAdmin && (

                        <Button
                            variant="outline"
                            size="icon"
                            className="border-red-500 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
                            onClick={() => {
                                handleDelete(value)
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ),
        },
    ]

    return (
        <AppLayout>
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <CardTitle className="text-2xl font-bold">Users List</CardTitle>
                        {isAdmin && (
                            <Button
                                onClick={() => router.visit('/users/create')}
                                className="inline-flex items-center gap-2  cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                Add User
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={users} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

export default UsersList