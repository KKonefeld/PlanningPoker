import { CurrentUser } from "@/model/user";
import { api } from "./client";
import { currentUserRes } from "@/api-mock-data/auth-data";

export namespace UserApi {
  export const getCurrentUser = async () => {
    const userId = localStorage.getItem("userId");
    // const res = await api.get<CurrentUser>(`user/${userId}`);
    const res = { data: currentUserRes };
    return res.data;
  };
}
