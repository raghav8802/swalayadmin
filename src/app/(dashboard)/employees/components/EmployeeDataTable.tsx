"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export type Employee = {
  _id: string;
  fullName: string;
  officialEmail: string;
  phoneNumber: string;
  role: string;
  department: string;
  status: string;
  assignedTo: string;
  joinDate: string; // YYYY-MM-DD
  salary: number; // in dollars
};

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    id: "employee",
    header: "Employee",
    cell: ({ row }) => {
      const name = row.original.fullName;
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {initials}
          </div>
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-xs text-gray-500">ID: {row.original._id?.slice(-4).padStart(4, '0')}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <div>
        <div className="flex items-center gap-1 text-sm">
          <span className="material-icons text-base align-middle">
          <i className="bi bi-envelope"></i>
          </span>
          {row.original.officialEmail}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="material-icons text-base align-middle">
          <i className="bi bi-telephone"></i>
          </span>
          {row.original.phoneNumber}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
        row.original.department === 'customerSupport' ? 'bg-blue-100 text-blue-800' :
        row.original.department === 'contentDeployment' ? 'bg-purple-100 text-purple-800' :
        row.original.department === 'ANR' ? 'bg-green-100 text-green-800' :
        row.original.department === 'HR' ? 'bg-pink-100 text-pink-800' :
        row.original.department === 'Marketing' ? 'bg-orange-100 text-orange-800' :
        row.original.department === 'IT' ? 'bg-indigo-100 text-indigo-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {row.original.department}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Position",
    cell: ({ row }) => <span className="font-medium">{row.original.role}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      let color = "";
      let label = row.original.status;
      if (label.toLowerCase() === "active") color = "bg-green-100 text-green-800";
      else if (label.toLowerCase() === "on leave") color = "bg-yellow-100 text-yellow-800";
      else color = "bg-red-100 text-red-800";
      return (
        <span className={`${color} text-xs font-medium px-2.5 py-0.5 rounded`}>
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
      );
    },
  },
  
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => (
      <span className="font-semibold text-black">₹{row.original.salary?.toLocaleString()}</span>
    ),
  },
  {
    id: "viewDetails",
    header: "View Details",
    cell: ({ row }) => (
      <Link href={`/employees/profile?employeeid=${btoa(row.original._id)}`}>
        <span className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md h-8 px-4 cursor-pointer">View</span>
      </Link>
    ),
  },
  {
    id: "edit",
    header: "Edit",
    cell: ({ row }) => (
      <Link href={`/employees/new?id=${btoa(row.original._id)}`}>
        <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-blue-600 hover:text-blue-700">Edit</span>
      </Link>
    ),
  },


];

export function EmployeeDataTable({ data }: { data: Employee[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: employeeColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <div className="ms-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={employeeColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
