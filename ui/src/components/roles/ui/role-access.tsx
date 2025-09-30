import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import type { Access } from "@/types";
import { formatDate } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/custom-ui/table-pagination";

type Props = {
  data: Access[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  search: string;
  handleFilterChange: (key: string, value: string | number) => void;
};

export const RoleAccess = ({ data, pagination, search, handleFilterChange }: Props) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState(search);

  const isAllSelected = data.length > 0 && selected.length === data.length;

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? data.map((a) => a.id) : []);
  };

  const toggleOne = (id: number, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));
  };

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Role Access</CardTitle>
          <div className="flex space-x-2">
            {selected.length > 0 ? (
              <Button variant="destructive" className="text-sm font-medium">
                Remove ({selected.length})
              </Button>
            ) : (
              <>
                <Button variant="outline" className="text-sm font-medium">
                  Add New Access
                </Button>
                <Button variant="outline" className="text-sm font-medium">
                  Copy Access from Existing Role
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Search access..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="secondary" onClick={() => handleFilterChange("access_search", searchTerm)}>
            Search
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={isAllSelected} onCheckedChange={(c) => toggleAll(!!c)} />
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((access) => (
              <TableRow key={access.id}>
                <TableCell>
                  <Checkbox checked={selected.includes(access.id)} onCheckedChange={(c) => toggleOne(access.id, !!c)} />
                </TableCell>
                <TableCell className="font-medium">{access.code}</TableCell>
                <TableCell>{access.label}</TableCell>
                <TableCell>{access.module_name}</TableCell>
                <TableCell>{formatDate(access.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && <div className="text-center py-6 text-gray-500 text-sm">No access records found.</div>}

        {/* Pagination */}
        <Pagination
          current={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => handleFilterChange("access_page", p)}
        />
      </CardContent>
    </Card>
  );
};

export const RoleAccessSkeleton = () => {
  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-36" />
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="border rounded-md">
          {/* Table Header Skeleton */}
          <div className="grid grid-cols-5 gap-2 border-b px-4 py-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Table Rows Skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 border-b px-4 py-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <Skeleton className="h-8 w-20" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};
