import DataTable, { type TableColumn } from 'react-data-table-component';
import type { User } from '../data/userService';
import { Link } from 'react-router-dom';
import useFormatDate from '../hooks/useFormatDate';

type Props = {
    data: User[];
    onDelete: (id: number) => void;
    emptyMessage?: string;
};

export default function UserTable({ data, onDelete }: Props) {
    const { parseToTimestamp, formatReadable } = useFormatDate();
    const propsMessage = (arguments[0] as Props).emptyMessage ?? 'No users to show.';

    const columns: TableColumn<User>[] = [
        { name: 'ID', selector: (row) => row.id, sortable: true },
        { name: 'First Name', selector: (row) => row.firstName, sortable: true },
        { name: 'Last Name', selector: (row) => row.lastName, sortable: true },
        { name: 'Mobile', cell: (row) => row.mobile, selector: (row) => row.mobile },
        { name: 'Age', selector: (row) => row.age, sortable: true },
        { name: 'Education', cell: (row) => row.education, selector: (row) => row.education },
        { name: 'Interests', cell: (row) => (row.interests || []).join(', '), selector: (row) => (row.interests || []).join(', ') },
        {
            name: 'Availability', cell: (row) => formatReadable(row.availabilityDate), sortable: true, selector: (row) => row.availabilityDate, sortFunction: (a, b) => parseToTimestamp(a.availabilityDate) - parseToTimestamp(b.availabilityDate)
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <Link to={`/users/${row.id}/edit`} className="text-blue-600">Edit</Link>
                    <button onClick={() => onDelete(row.id)} className="text-red-600">Delete</button>
                </div>
            ),
            ignoreRowClick: true,
            button: true,
        },
    ];
    const ExpandedComponent = ({ data }: { data: any }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

    return (
        <div className="bg-white rounded shadow">
            <DataTable
                columns={columns}
                data={data}
                noDataComponent={<div className="p-4 text-gray-500">{propsMessage}</div>}
                expandableRows
                selectableRows
                expandableRowsComponent={ExpandedComponent}
                pagination
                responsive
                highlightOnHover
                dense
            />
        </div>
    );
}
