import { useUserStore } from "@/stores/user-store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("userId");
    useUserStore.getState().setUser(null);
    queryClient.clear();
    router.push("/login");
  }, [queryClient, router]);

  return logout;
}
