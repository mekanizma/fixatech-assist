import { useSyncExternalStore } from "react";
import { getData, getServerSnapshot, subscribe } from "@/lib/service-desk/store";

export function useDeskData() {
  return useSyncExternalStore(subscribe, getData, getServerSnapshot);
}
