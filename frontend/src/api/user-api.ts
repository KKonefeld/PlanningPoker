import { CurrentUser } from "@/model/user";
import { api } from "./client";

export namespace UserApi {
  export const getCurrentUser = async () => {
    const userId = localStorage.getItem("userId");
    const res = await api.get<CurrentUser>(`user/${userId}`);
    return res.data;
  };
}
