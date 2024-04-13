import { RoomApi } from "@/api/room-api";
import { UserStoryApi } from "@/api/userstory-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const userStoryKeys = {
  userStories: () => ["userstory", "list"],
  userStory: (userStoryId: number) => ["userstory", userStoryId],
};

export function useUserStoryListQuery() {
  const query = useQuery({
    queryKey: userStoryKeys.userStories(),
    queryFn: UserStoryApi.getUserStories,
  });
  return query;
}
