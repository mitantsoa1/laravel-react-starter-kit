import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { router, usePage } from '@inertiajs/react'
import Swal from 'sweetalert2'
import AppLayout from '@/layouts/app-layout'
import { Permission } from '@/types'
import { useAdmin } from '@/hooks/use-admin'
import { DataTable } from './data-table'
import { useAlert } from '@/hooks/use-alert'


interface PermissionsListProps {
    permissions: Permission[]
}

const PermissionsList: React.FC<PermissionsListProps> = ({ permissions }) => {
    const { isAdmin } = useAdmin();

    useAlert()

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Do you want to delete this permission?",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#111",
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.delete(`/permissions/${id}`);
            }
        });
    }

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "id",
            header: "Actions",
            cell: (value: number) => (
                <div className="flex justify-center gap-2">
                    {isAdmin && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white cursor-pointer"
                                onClick={() => router.get(`/permissions/${value}/edit`)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-red-500 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
                                onClick={() => handleDelete(value)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AppLayout>
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <CardTitle className="text-2xl font-bold">Permissions Management</CardTitle>
                        {isAdmin && (
                            <Button
                                onClick={() => router.visit('/permissions/create')}
                                className="inline-flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                                Add Permission
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={permissions} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

export default PermissionsList