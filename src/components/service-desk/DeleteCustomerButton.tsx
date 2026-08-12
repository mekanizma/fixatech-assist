import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCompany } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  companyId: string;
  companyName: string;
  ticketCount?: number;
  className?: string;
};

export function DeleteCustomerButton({
  companyId,
  companyName,
  ticketCount = 0,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const qc = useQueryClient();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCompany(companyId);
      await qc.invalidateQueries({ queryKey: deskKeys.all });
      toast.success("Müşteri silindi", { description: companyName });
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Müşteri silinemedi");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "touch-manipulation text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive",
            className,
          )}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Sil
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Müşteri silinsin mi?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">{companyName}</span> kalıcı olarak
                silinecek.
              </p>
              {ticketCount > 0 ? (
                <p>
                  Bu müşteriye ait <span className="font-semibold text-foreground">{ticketCount}</span>{" "}
                  servis kaydı da silinecek. Bu işlem geri alınamaz.
                </p>
              ) : (
                <p>Bu işlem geri alınamaz.</p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <AlertDialogCancel disabled={deleting} className="mt-0">
            Vazgeç
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(e) => {
              e.preventDefault();
              void handleDelete();
            }}
          >
            {deleting ? "Siliniyor..." : "Evet, sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
