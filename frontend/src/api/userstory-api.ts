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

  export const exportUserStories = async (roomId: number) => {
    const result = await api.get(`/user-stories/export/${roomId}`);
    return result.data;
  }

  export const importUserStories = async (roomId: number, file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    const result = await api.post(`/user-stories/import/${roomId}`, formData);
    
    return result.data;
  }
}
