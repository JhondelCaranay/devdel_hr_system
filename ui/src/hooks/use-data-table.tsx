import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

type DataTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
};

const useDatatable = <TData, TValue>({ data, columns, pageCount }: DataTableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    initialState: {},

    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRowId: (row) => (row as any).id,
    manualPagination: true, // important: server-side
    manualFiltering: true, // important: server-side
    pageCount, // total pages from API
  });

  return { table, rowSelection, setRowSelection, sorting, setSorting, columnVisibility, setColumnVisibility };
};

export default useDatatable;
