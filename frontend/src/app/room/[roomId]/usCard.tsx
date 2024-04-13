import { UserStory } from "@/model/userstory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
type Props = {
  data: UserStory;
};

const UsCard: React.FC<Props> = ({ data }) => {
  console.log(data);
  return (
    <div className=" w-full max-w-sm rounded-sm border-2 border-white bg-background2 p-4 text-white">
      <p>{data.title}</p>
      <Dialog>
        <DialogTrigger>
          <Button size="sm">Show Details</Button>
        </DialogTrigger>
        <DialogContent className="bg-background text-white">
          <DialogHeader>
            <DialogTitle>{data.title}</DialogTitle>
            <DialogDescription>Sample Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsCard;
