import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStoryListQuery } from "@/queries/userstory.queries";
import UsCard from "./usCard";
import DropzoneComponent from "./dropzone";
import { Button } from "@/components/ui/button";

type Props = {
  roomId: number;
  createUserStoryHandle: (title: string, description: string) => void;
};

const UsList: React.FC<Props> = ({ roomId, createUserStoryHandle }) => {
  const { data, isLoading, isError, error } = useUserStoryListQuery(roomId);
  
  const handleclick = () => {
    createUserStoryHandle('New User Story', 'New Description');
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
      <ScrollArea className="h-full">
      <Button
        onClick={handleclick}
      >
        Create New User Story
      </Button>
        <div className="flex flex-col gap-4">
          {data?.map((el) => <UsCard key={el.id} data={el} />)}
        </div>
      </ScrollArea>
      <hr className="border-white/50 " />
      <DropzoneComponent />
    </>
  );
};

export default UsList;
