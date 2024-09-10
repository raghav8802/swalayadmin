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

export type Payment = {
  _id: string;
  labelId: string;
  labelName: string;
  amount: string;
  payout_report_url: string;
  status: boolean; // Assuming status is a boolean
  time: string;
  type: string;
  usertype: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "serial",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "labelName",
    header: "Label Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("usertype") === "super" 
          ? (row.getValue("labelName") || row.getValue("username"))
          : row.getValue("labelName")}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return (
        <div className="text-right font-medium">₹ {amount.toFixed(2)}</div>
      );
    },
  },
  {
    accessorKey: "Type",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
    //   const status = row.getValue("status") ? "Completed" : "Pending";
      const type = row.getValue("type") ? "Completed" : "Pending";

    //   const statusColor: { [key: string]: string } = {
    //     Pending: "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300",
    //     Completed: "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300",
    //   };

      return (
        <div className="text-right">
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: () => <div className="text-right">Date</div>,
    cell: ({ row }) => {
      const timeValue = row.getValue("time");

      const date =
        timeValue && typeof timeValue === "string" ? new Date(timeValue) : null;

      if (date && !isNaN(date.getTime())) {
        const localDate = date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return <div className="text-right font-medium">{localDate}</div>;
      } else {
        return <div className="text-right font-medium">Invalid Date</div>;
      }
    },
  },
  {
    accessorKey: "payout_report_url",
    header: () => <div className="text-right">Payout Report</div>,
    cell: ({ row }) => {
      const url = row.getValue("payout_report_url");
      return (
        <div className="text-right">
          {url ? (
            
            <Link
              className="px-2 py-2 rounded bg-black text-white-400 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded text-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              href={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}/labels/payments/payoutReports/${url}`}
              target="_blank"
            >
              View Report
            </Link>
          ) : (
            <span>No Report</span>
          )}
        </div>
      );
    },
  },
];

export default function PaymentList({ data }: { data: Payment[] }) {
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
          value={(table.getColumn("labelName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("labelName")?.setFilterValue(event.target.value)
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
