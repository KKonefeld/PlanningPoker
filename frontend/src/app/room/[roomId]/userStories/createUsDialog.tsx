import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

type Props = {
  addUserStoryHandle: (title: string, description: string) => void;
};

const CreateUsDialog: React.FC<Props> = ({ addUserStoryHandle }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (titleRef.current && descRef.current) {
      addUserStoryHandle(titleRef.current.value, descRef.current.value);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button size="sm">Create New User Story</Button>
      </DialogTrigger>
      <DialogContent className="bg-background text-white">
        <DialogHeader>
          <DialogTitle>Create New User Story</DialogTitle>
          <DialogDescription>
            <Label className="text-sm text-white">Title</Label>
            <Input className="mb-4 mt-2" ref={titleRef} />
            <Label className="text-sm text-white">Description</Label>
            <Input className="mt-2" ref={descRef} />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="destructive" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateUsDialog;
