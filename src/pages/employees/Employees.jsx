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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useLoaderData } from "react-router-dom";
import InsertEmployee from "./InsertEmployee";
import DeleteEmployee from "./DeleteEmployee";
import UpdateEmployee from "./updateEmployee";
import { useAuth } from "@/hooks/useAuth";
import { UpdateStatus } from "../orders/UpdateStatus";
import { useProfiles } from "@/hooks/useEmployeesQuery";
const roles = [
  {
    name: "Owner",
    description:
      "Full access to all features — cannot delete own account or change own role.",
    badgeClass: "bg-primary/20 text-primary border-primary/30",
  },
  {
    name: "Admin",
    description:
      "Can manage menu, employees, and orders — cannot delete or modify Owner or other Admin accounts.",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  {
    name: "Cashier",
    description: "Can place orders only — no access to management or settings.",
    badgeClass: "bg-primary/5 text-primary border-primary/10",
  },
];

export default function EmployeesPage() {
  const { user } = useAuth();

  const { data: profiles } = useProfiles() || {};
  return (
    <>
      {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Order Details
          </h1>
          <p className="text-muted-foreground mt-1">
            View invoice information and purchased Items
          </p>
        </div>

        <InsertEmployee />
      </div> */}

      <Table>
        <TableCaption>
          {profiles.length - 1} Employees and one Owner
        </TableCaption>
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
      <div className="mt-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Role permissions
        </p>

        <div className="rounded-lg border bg-muted/50 divide-y divide-border">
          {roles.map((role) => (
            <div key={role.name} className="flex items-center gap-4 px-4 py-3">
              <Badge
                variant="outline"
                className={`w-16 justify-center shrink-0 ${role.badgeClass}`}
              >
                {role.name}
              </Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
