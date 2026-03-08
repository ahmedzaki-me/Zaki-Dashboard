import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Trash, User } from "lucide-react";

import { useLoaderData } from "react-router-dom";
import InsertEmployee from "./InsertEmployee";
import DeleteEmployee from "./DeleteEmployee";
import UpdateEmployee from "./updateEmployee";
import { useAuth } from "@/hooks/useAuth";
import { UpdateStatus } from "../orders/UpdateStatus";
export default function EmployeesPage() {
  const { user } = useAuth();
  const { profiles } = useLoaderData() || {};

  return (
    <>
      <Table>
        <TableCaption>Employees</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Avatar</TableHead>
            <TableHead className="w-25">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Manage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles?.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={profile.avatar_url}
                    alt={profile.full_name}
                  />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                  {user.id === profile.id && (
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                  )}
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{profile.full_name}</TableCell>
              <TableCell>{profile.email}</TableCell>
              <TableCell className="capitalize">{profile.role}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <DeleteEmployee employee={profile}>
                  <Button
                    variant="destructive"
                    className="bg-red-50 dark:bg-amber-50 dark:text-red-600 dark:hover:text-amber-100 dark:hover:bg-red-600 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-colors duration-300"
                  >
                    <Trash />
                  </Button>
                </DeleteEmployee>

                <UpdateEmployee user={profile} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InsertEmployee />
      <UpdateStatus />
    </>
  );
}
