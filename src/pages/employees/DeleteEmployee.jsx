import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TrashIcon } from "lucide-react";
import { deleteEmployee } from "./employeesActions";
import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";

export default function DeleteEmployee({ employee, children }) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const { error } = await deleteEmployee(employee.id, employee.avatar_url);

    if (!error) {
      toast.success("The employee was scanned successfully");
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    } else {
      console.log(error);

      toast.error("The employee was not cleared");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive  dark:bg-destructive/20 dark:text-destructive">
            <TrashIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {employee?.full_name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
