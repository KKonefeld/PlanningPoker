import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStoryListQuery } from "@/queries/userstory.queries";
import UsCard from "./usCard";
import DropzoneComponent from "../dropzone";
import { Button } from "@/components/ui/button";
import CreateUsDialog from "./createUsDialog";

type Props = {
  roomId: number;
  createUserStoryHandle: (title: string, description: string) => void;
  deleteUserStoryHandle: (id: number) => void;
  updateUserStoryHandle: (
    id: number,
    title: string,
    description: string,
  ) => void;
  addUserStoryHandle: (title: string, description: string) => void;
};

const UsList: React.FC<Props> = ({
  roomId,
  createUserStoryHandle,
  deleteUserStoryHandle,
  updateUserStoryHandle,
  addUserStoryHandle,
}) => {
  const { data, isLoading, isError, error } = useUserStoryListQuery(roomId);

  const handleclick = () => {
    createUserStoryHandle("New User Story", "New Description");
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }
  if (!data) {
    return <h1>No room</h1>;
  }
  return (
    <>
      <CreateUsDialog addUserStoryHandle={addUserStoryHandle} />
      {/* <Button onClick={handleclick}>Create New User Story</Button> */}
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4">
          {data?.map((el) => (
            <UsCard
              key={el.id}
              data={el}
              deleteUserStoryHandle={deleteUserStoryHandle}
              updateUserStoryHandle={updateUserStoryHandle}
            />
          ))}
        </div>
      </ScrollArea>
      <hr className="border-white/50 " />
      <DropzoneComponent />
    </>
  );
};

export default UsList;
