import { UserStory } from "@/model/userstory";
import { api } from "./client";

export namespace UserStoryApi {

  export const listUserStories = async (roomId: number) => {
    const result = await api.get<UserStory[]>(`/user-stories/${roomId}`);
    return result.data;
  };

  export const getUserStoryDetails = async (userStoryId: number) => {
    const result = await api.get<UserStory>(`/user-stories/details/${userStoryId}`);
    return result.data;
  }
}
