'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Label {
  _id: string;
  lable: string;
  subscriptionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionPlan: string;
  subscriptionpaymentId: string;
  subscriptionprice: string;
}

interface SubscriptionDataTableProps {
  data: Label[];
  loading?: boolean;
}

export function SubscriptionDataTable({ data, loading = false }: SubscriptionDataTableProps) {
    
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  const getStatusColor = (status: string | undefined | null) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'active':
        return 'bg-green-500';
      case 'expired':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const columns: ColumnDef<Label>[] = [
    {
      id: "serialNumber",
      header: "Sr. No.",
      cell: ({ row }) => {
        return <div>{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "lable",
      header: "Label Name",
      cell: ({ row }) => (
        <div
          className="font-medium cursor-pointer text-blue-600 underline"
          onClick={() => {
            setSelectedLabel(row.original);
            setShowModal(true);
          }}
        >
          {row.getValue("lable")}
        </div>
      ),
    },
    {
      accessorKey: "subscriptionPlan",
      header: "Subscription Plan",
    },
    {
      accessorKey: "subscriptionStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("subscriptionStatus") as string;
        return (
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "subscriptionStartDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = row.getValue("subscriptionStartDate") as string;
        return date ? format(new Date(date), 'dd/MM/yyyy') : 'N/A';
      },
    },
    {
      accessorKey: "subscriptionEndDate",
      header: "End Date",
      cell: ({ row }) => {
        const date = row.getValue("subscriptionEndDate") as string;
        return date ? format(new Date(date), 'dd/MM/yyyy') : 'N/A';
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setSelectedLabel(null);
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by label name..."
          value={(table.getColumn("lable")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("lable")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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

      {showModal && selectedLabel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-3xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedLabel.lable}</h2>
                <p className="text-gray-500 text-sm">Label Subscription Details</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-700 text-xm">Plan</span>
                <div className="font-semibold text-lg">{selectedLabel.subscriptionPlan}</div>
              </div>
              <div>
                <span className="text-gray-700 text-xm">Status</span>
                <div className="inline-flex items-center gap-2">
                  <span className={`h-2 ms-3 w-2 rounded-full ${getStatusColor(selectedLabel.subscriptionStatus)}`}></span>
                  <span className="font-semibold">{selectedLabel.subscriptionStatus}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-700 text-xm">Start Date</span>
                <div>{selectedLabel.subscriptionStartDate ? format(new Date(selectedLabel.subscriptionStartDate), 'dd/MM/yyyy') : 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-700 text-xm">End Date</span>
                <div>{selectedLabel.subscriptionEndDate ? format(new Date(selectedLabel.subscriptionEndDate), 'dd/MM/yyyy') : 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-700 text-xm">Price</span>
                <div className="font-semibold text-lg">{selectedLabel.subscriptionprice}</div>
              </div>
              <div>
                <span className="text-gray-700 text-xm">Payment ID</span>
                <div className="font-semibold text-xm">{selectedLabel.subscriptionpaymentId}</div>
              </div>
            </div>
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="text-xs text-gray-400">Contact admin for more details or to upgrade your plan.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}