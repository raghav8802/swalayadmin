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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export type LabelSchema = {
  _id: string;
  lable: string | null; // Fixed typo: "lable" → "label" (if applicable)
  username: string;
  usertype: string;
};

export const columns: ColumnDef<LabelSchema>[] = [
  {
    accessorKey: "serial",
    header: "S.No",
    cell: ({ row }) => row.index + 1, // Automatically generate serial numbers
  },
  {
    accessorKey: "lable",
    header: "Label Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.usertype === "super" // Access usertype from row.original
          ? row.getValue("lable") || row.original.username // Fallback to username if lable is null
          : row.getValue("lable")}
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "usertype",
    header: "User Type",
  },
  {
    accessorKey: "payin_report_url",
    header: () => <div className="text-right">Pay In</div>,
    cell: ({ row }) => {
      const id = row.original._id;
      const url = id ? btoa(String(id)) : null;
      return (
        <div className="text-right">
          {url ? (
            <Link
              className="px-2 py-2 rounded bg-black text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm"
              href={`/payments/label/payin/${url}`}
              target="_blank"
            >
              View Details
            </Link>
          ) : (
            <span>No Report</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "payout_report_url",
    header: () => <div className="text-right">Pay Out</div>,
    cell: ({ row }) => {
      const id = row.original._id;
      const url = id ? btoa(String(id)) : null;
      return (
        <div className="text-right">
          {url ? (
            <Link
              className="px-2 py-2 rounded bg-black text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm"
              href={`/payments/label/payout/${url}`}
              target="_blank"
            >
              View Details
            </Link>
          ) : (
            <span>No Report</span>
          )}
        </div>
      );
    },
  },
  
];

export default function RoyaltyLabelList({ data }: { data: LabelSchema[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});


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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 space-x-4">
        <input
          placeholder="Filter by label name..."
          value={(table.getColumn("lable")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("lable")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border px-2 py-1 rounded"
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
                  colSpan={columns.length}
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