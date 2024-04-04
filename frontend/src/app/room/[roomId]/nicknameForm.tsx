import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  setNickname: (nickname: string) => void;
};

const formSchema = z.object({
  nickname: z.string().min(3, {
    message: "Your nickname must be at least 3 characters.",
  }),
});

const NicknameForm: React.FC<Props> = ({ setNickname }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setNickname(values.nickname);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[40rem] space-y-8 px-8"
      >
        <FormField
          control={form.control}
          name={"nickname"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your nickname</FormLabel>
              <FormControl>
                <Input placeholder="Example nickname" {...field} />
              </FormControl>
              <FormDescription>
                Your nickname will be visible to everyone in the room.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="ml-auto block">
          Enter room
        </Button>
      </form>
    </Form>
  );
};

export default NicknameForm;
