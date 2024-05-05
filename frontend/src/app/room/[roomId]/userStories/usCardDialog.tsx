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
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { UserStory, UserStoryTask } from "@/model/userstory";

import { Label } from "@/components/ui/label";

type Props = {
  data: UserStory;
  deleteUserStoryHandle: (id: number) => void;
  updateUserStoryHandle: (
    id: number,
    title: string,
    description: string,
  ) => void;
};

const UsCardDialog: React.FC<Props> = ({
  data,
  deleteUserStoryHandle,
  updateUserStoryHandle,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const handleToggle = (status: boolean = true) => {
    setIsEditing(false);
    setIsOpen(status);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (titleRef.current && descRef.current) {
      updateUserStoryHandle(
        data.id,
        titleRef.current.value,
        descRef.current.value,
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger>
        <Button onClick={() => handleToggle(true)} size="sm">
          Show Details
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background text-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? (
              <>
                <Label className="text-sm text-white">Title</Label>
                <Input
                  className="mb-4 mt-2"
                  ref={titleRef}
                  defaultValue={data.title}
                />
              </>
            ) : (
              data.title
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? (
              <>
                <Label className="text-sm text-white">Description</Label>
                <Input
                  className="mt-2"
                  defaultValue={data.description}
                  ref={descRef}
                />
              </>
            ) : (
              data.description
            )}
          </DialogDescription>
        </DialogHeader>
        {data.tasks.length > 0 && (
          <div>
            <p>Tasks:</p>
            {data.tasks.map((task: UserStoryTask) => (
              <div key={task.id}>
                <p>{task.title}</p>
                <p>{task.description}</p>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          {isEditing ? (
            <Button variant="destructive" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => deleteUserStoryHandle(data.id)}
            >
              Delete
            </Button>
          )}
          {isEditing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsCardDialog;
