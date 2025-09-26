"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DataTableSkeleton() {
  return (
    <div>
      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 gap-4">
        {/* Search input */}
        <Skeleton className="h-10 w-full lg:max-w-sm" />

        <div className="flex gap-4">
          <Skeleton className="h-10 w-20" /> {/* Filters */}
          <Skeleton className="h-10 w-24" /> {/* Columns */}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-md bg-white">
        <Table className="border border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="border">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="border">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="border">
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead className="border">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="border w-[50px] text-center">
                <Skeleton className="h-4 w-6 mx-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                <TableCell className="border">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="border">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="border">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="border">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="border text-center">
                  <Skeleton className="h-8 w-8 mx-auto rounded-full" /> {/* actions button */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-4 w-32" /> {/* "Page X of Y" */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" /> {/* Prev */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
          <Skeleton className="h-8 w-16" /> {/* Next */}
        </div>
      </div>
    </div>
  );
}
