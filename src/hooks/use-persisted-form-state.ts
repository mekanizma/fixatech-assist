import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export const ADMIN_TALEP_DRAFT_KEY = "fixatech.admin.talep-form.draft";
export const ADMIN_TEKLIF_DRAFT_KEY = "fixatech.admin.teklif-form.draft";

function readDraft<T>(key: string, empty: () => T): T {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<T>;
    if (!parsed || typeof parsed !== "object") return empty();
    return { ...empty(), ...parsed };
  } catch {
    return empty();
  }
}

export function clearPersistedFormDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore quota / private mode */
  }
}

/** Admin form taslağını localStorage'da tutar; sayfa yenilenince / başka sekmeye gidip dönünce korunur. */
export function usePersistedFormState<T extends object>(
  key: string,
  empty: () => T,
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [form, setForm] = useState<T>(() => readDraft(key, empty));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [key, form]);

  const clearDraft = () => {
    clearPersistedFormDraft(key);
    setForm(empty());
  };

  return [form, setForm, clearDraft];
}
