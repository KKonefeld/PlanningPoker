import { UserStoryApi } from "@/api/userstory-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const userStoryKeys = {
  userStories: (roomId: number) => ["userstory", roomId],
  userStory: (userStoryId: number) => ["userstory", userStoryId],
};

export function useUserStoryListQuery(roomId: number) {
  const query = useQuery({
    queryKey: userStoryKeys.userStories(roomId),
    queryFn: () => UserStoryApi.listUserStories(roomId),
  });
  return query;
}
