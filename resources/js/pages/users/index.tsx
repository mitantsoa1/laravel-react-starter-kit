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
import { Role, User, UserWithRelations } from '@/types'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/hooks/use-admin'
import { useAlert } from '@/hooks/use-alert'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'


interface UsersListProps {
    users: UserWithRelations[]
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
    const { isAdmin, currentUser: user } = useAdmin();

    useAlert()

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
                router.delete(`/users/${id}`);

            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
            router.reload()
        });
    }

    const columns: ColumnDef<User>[] = [
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
            cell: (props) => {
                const roles = props.getValue() as Role[];

                return (
                    <div className="flex flex-wrap gap-2">
                        {roles?.map((role: Role) => {
                            const roleColors = {
                                admin: "bg-red-100 text-red-800 border-red-200",
                                manager: "bg-blue-100 text-blue-800 border-blue-200",
                                user: "bg-green-100 text-green-800 border-green-200",
                                editor: "bg-purple-100 text-purple-800 border-purple-200",
                                viewer: "bg-gray-100 text-gray-800 border-gray-200"
                            };

                            const roleIcons = {
                                SUPER_ADMIN: "👑",
                                ROLE_ADMIN: "💼",
                                ROLE_USER: "👤",
                                editor: "✏️",
                                viewer: "👀"
                            };

                            const colorClass = roleColors[role.name as keyof typeof roleColors] || "bg-gray-100 text-gray-800 border-gray-200";
                            const icon = roleIcons[role.name as keyof typeof roleIcons] || "🔹";

                            return (
                                <div
                                    key={role.id}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${colorClass}`}
                                >
                                    <span className="text-xs">{icon}</span>
                                    <span className="capitalize">{role.name}</span>
                                </div>
                            );
                        })}
                    </div>
                )
            },
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: (props) => {
                const dateValue = props.getValue() as string;
                return new Date(dateValue).toLocaleDateString();
            },
        },
        {
            accessorKey: "id",
            header: "Actions",
            cell: (props) => {
                const userId = props.getValue() as number;
                const currentUser = props.row.original; // Accès à l'objet User complet

                return (
                    <div className="flex justify-center gap-2">
                        {(isAdmin || user?.id === userId) && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white cursor-pointer"
                                onClick={() => handleEdit(userId)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                        {isAdmin && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-red-500 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
                                onClick={() => handleDelete(userId)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout>
            <div className="container mx-auto py-8 px-2">
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