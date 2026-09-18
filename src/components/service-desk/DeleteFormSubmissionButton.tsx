import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { useDeleteFormSubmission } from "@/hooks/use-form-submissions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  submissionId: string;
  summary: string;
  onDeleted?: () => void;
  variant?: "button" | "icon";
  className?: string;
};

export function DeleteFormSubmissionButton({
  submissionId,
  summary,
  onDeleted,
  variant = "button",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const remove = useDeleteFormSubmission();

  const handleDelete = () => {
    remove.mutate(submissionId, {
      onSuccess: () => {
        toast.success("Talep formu silindi", { description: summary });
        setOpen(false);
        onDeleted?.();
      },
      onError: (e) => {
        toast.error(e instanceof Error ? e.message : "Form silinemedi");
      },
    });
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
            aria-label="Talep formunu sil"
            title="Sil"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full touch-manipulation text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive",
              className,
            )}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Formu sil
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Talep formu silinsin mi?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-foreground">{summary || "Bu form"}</span> kalıcı olarak
            silinecek. Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <AlertDialogCancel disabled={remove.isPending} className="mt-0 min-h-11">
            Vazgeç
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={remove.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 min-h-11"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {remove.isPending ? "Siliniyor..." : "Evet, sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
