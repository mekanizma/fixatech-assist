import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
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
import { deleteTicket } from "@/lib/service-desk/api";
import { deskKeys } from "@/lib/service-desk/query-keys";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  ticketId: string;
  ticketCode: string;
  /** Silince kayitlar listesine yonlendir (detay sayfasi icin) */
  redirectToList?: boolean;
  variant?: "button" | "icon";
  className?: string;
};

export function DeleteTicketButton({
  ticketId,
  ticketCode,
  redirectToList = false,
  variant = "button",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTicket(ticketId);
      await qc.invalidateQueries({ queryKey: deskKeys.all });
      toast.success("Servis kaydı silindi", { description: ticketCode });
      setOpen(false);
      if (redirectToList) {
        navigate({ to: "/app/admin/kayitlar" });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kayıt silinemedi");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive touch-manipulation",
              className,
            )}
            aria-label={`${ticketCode} kaydını sil`}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className={cn("touch-manipulation", className)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Kaydı Sil
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Servis kaydı silinsin mi?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-foreground">{ticketCode}</span> kaydı kalıcı olarak
            silinecek. Bu işlem geri alınamaz.
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
