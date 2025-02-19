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
import { Modal } from "@/components/Modal";
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
import { apiPost } from "@/helpers/axiosRequest";
import toast from "react-hot-toast";

export type Payment = {
  _id: string;
  labelId: string;
  labelName: string;
  amount: string;
  status: string;
  request_at: string;
};

type PaymentStatus = "Pending" | "Completed" | "Rejected" | "Failed";

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
      <div className="font-medium">{row.getValue("labelName")}</div>
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
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as PaymentStatus;

      // Define the statusColor object with the provided styles
      const statusColor: { [key in PaymentStatus]: string } = {
        Pending:
          "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300",
        Completed:
          "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300",
        Rejected:
          "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300",
        Failed:
          "bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300",
      };

      return (
        <div className="text-right">
          <span className={`${statusColor[status]}`}>{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "request_at",
    header: () => <div className="text-right">Date</div>,
    cell: ({ row }) => {
      const timeValue = row.getValue("request_at");

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
    accessorKey: "history",
    header: () => <div className="text-right">Payout History</div>,
    cell: ({ row }) => {
      const { labelId } = row.original;

      return (
        <div className="text-right">
          <Link
            className="px-2 py-2 rounded bg-black text-white-400 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded text-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            href={`/payments/label/payout/${btoa(labelId)}`}
          >
            View History
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "Action",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const { _id, labelId, labelName, amount } = row.original;

      return (
        <div className="text-right p-1">
          <Link
            href={`/payments/payout/${btoa(_id)}`}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Pay
          </Link>
        </div>
      );
    },
  },
];

export function PaymentPendingList({ data }: { data: Payment[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // State for managing modal visibility and data
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalData, setModalData] = React.useState<Payment | null>(null);

  const handleSave = async () => {
    if (modalData) {
      try {
        const response = await apiPost("/api/payments/addPayment", {
          labelId: modalData.labelId,
          amount: modalData.amount,
          time: new Date().toISOString(), // Example for current time
        });

        setIsModalVisible(false);
        if (response.success) {
          toast.success(response.message);
          // Fetch or refresh data here if needed
        } else {
          toast.error(response.message);
        }
        setModalData(null); // Clear modal data after saving
      } catch (error) {
        toast.error("Internal server error");
      }
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

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
        <Input
          placeholder="Filter by label name..."
          value={
            (table.getColumn("labelName")?.getFilterValue() as string) ?? ""
          }
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

      {/* Modal */}
      {isModalVisible && modalData && (
        <Modal
          isVisible={isModalVisible}
          triggerLabel="Submit"
          title="New Payment"
          onSave={handleSave}
          onClose={handleClose}
        >
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <label className="block text-sm font-medium">Label Name</label>
              <Input value={modalData.labelName} readOnly />
            </div>
            <div className="col-span-6">
              <label className="block text-sm font-medium">Amount</label>
              <Input value={modalData.amount} readOnly />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
