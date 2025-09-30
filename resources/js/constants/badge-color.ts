export const getColorClass = (name: string) => {
    const firstWord = name.split('_')[0].toLowerCase();
    const colors = {
        create: "bg-green-50 text-green-700 border-green-200",
        read: "bg-blue-50 text-blue-700 border-blue-200",
        view: "bg-cyan-50 text-cyan-700 border-cyan-200",
        update: "bg-yellow-50 text-yellow-700 border-yellow-200",
        edit: "bg-orange-50 text-orange-700 border-orange-200",
        delete: "bg-red-50 text-red-700 border-red-200",
        manage: "bg-purple-50 text-purple-700 border-purple-200",
        admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
        default: "bg-gray-50 text-gray-700 border-gray-200"
    };
    return colors[firstWord as keyof typeof colors] || colors.default;
};