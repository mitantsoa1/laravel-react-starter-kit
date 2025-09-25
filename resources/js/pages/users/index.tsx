import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DataTable } from "./data-table"
import { router } from '@inertiajs/react'

interface User {
    id: number
    name: string
    email: string
    created_at: string
}

interface UsersListProps {
    users: User[]
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {

    const handleEdit = (id: number) => {
        router.get(`/users/${id}/edit`);
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
            accessorKey: "created_at",
            header: "Created At",
            cell: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            accessorKey: "id",
            header: "Actions",
            cell: (value: number) => (
                <div className="flex justify-center gap-2">
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
                    <Button
                        variant="outline"
                        size="icon"
                        className="border-red-500 text-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
                        onClick={() => {
                            // handleDelete(value)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                    <CardTitle className="text-2xl font-bold">Users List</CardTitle>
                    <Button
                        onClick={() => router.visit('/users/create')}
                        className="inline-flex items-center gap-2  cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        Add User
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={users} />
                </CardContent>
            </Card>
        </div>
    )
}

export default UsersList