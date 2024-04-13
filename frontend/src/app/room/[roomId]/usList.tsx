import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStoryListQuery } from "@/queries/userstory.queries";
import UsCard from "./usCard";

const UsList: React.FC = () => {
  const { data, isLoading, isError, error } = useUserStoryListQuery();

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
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4">
        {data?.map((el) => <UsCard key={el.id} data={el} />)}
      </div>
    </ScrollArea>
  );
};

export default UsList;
