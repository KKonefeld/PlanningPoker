import { UserStory, UserStoryTask } from "@/model/userstory";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UsCardDialog from "./usCardDialog";
type Props = {
  data: UserStory;
  deleteUserStoryHandle: (id: number) => void;
  updateUserStoryHandle: (
    id: number,
    title: string,
    description: string,
  ) => void;
  createUserStoryTaskHandle: (
    userStoryId: number,
    title: string,
    description: string,
  ) => void;
  deleteUserStoryTaskHandle: (id: number) => void;
  updateUserStoryTaskHandle: (
    id: number,
    title: string,
    description: string,
  ) => void;
  setVotedTaskHandle: (task: UserStoryTask) => void;
};

const UsCard: React.FC<Props> = ({
  data,
  deleteUserStoryHandle,
  updateUserStoryHandle,
  createUserStoryTaskHandle,
  deleteUserStoryTaskHandle,
  updateUserStoryTaskHandle,
  setVotedTaskHandle,
}) => {
  return (
    <div className="w-full max-w-sm rounded-sm border-2 border-white bg-background2 p-4 text-white">
      <p>{data.title}</p>
      {/* <Button size="sm">Show Details</Button> */}
      <UsCardDialog
        data={data}
        deleteUserStoryHandle={deleteUserStoryHandle}
        updateUserStoryHandle={updateUserStoryHandle}
        createUserStoryTaskHandle={createUserStoryTaskHandle}
        deleteUserStoryTaskHandle={deleteUserStoryTaskHandle}
        updateUserStoryTaskHandle={updateUserStoryTaskHandle}
        setVotedTaskHandle={setVotedTaskHandle}
      />
    </div>
  );
};

export default UsCard;
