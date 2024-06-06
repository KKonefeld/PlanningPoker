import { UserApi } from "@/api/user-api";
import { useQuery } from "@tanstack/react-query";

export const roomKeys = {
  history: () => ["history"],
};

export function useUserHistoryQuery() {
  const query = useQuery({
    queryKey: roomKeys.history(),
    queryFn: () => UserApi.getCurrentUserHistory(),
  });
  return query;
}
