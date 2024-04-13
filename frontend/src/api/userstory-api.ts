import { UserStory } from "@/model/userstory";
import { api } from "./client";
import { userStories } from "@/api-mock-data/userstory-data";

export namespace UserStoryApi {
  export const getUserStories = async () => {
    // const res = await api.get<UserStory[]>("/userstories");
    // return res.data;
    return userStories;
  };
}
