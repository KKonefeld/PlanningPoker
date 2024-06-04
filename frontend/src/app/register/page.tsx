"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { VOTING_SYSTEM } from "@/model/user";
import { useCreateRoomMutation } from "@/queries/room.queries";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    username: z.string({ required_error: "This field is required" }).min(4, {
      message: "Username name must be at least 4 characters long.",
    }),
    email: z
      .string({ required_error: "This field is required" })
      .email({ message: "Invalid e-mail" }),
    password: z
      .string({ required_error: "This field is required" })
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string({ required_error: "This field is required" })
      .min(6, "Password must be at least 6 characters long"),
    terms: z.boolean().refine((value) => value === true, {
      message: "This field is required",
    }),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export default function CreateForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const createRoomMutation = useCreateRoomMutation({
    onSuccess: (roomId) => {
      router.push(`/room/${roomId}`);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: undefined,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
      terms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[40rem] space-y-8 px-8"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room's name</FormLabel>
              <FormControl>
                <Input placeholder="Example name" {...field} />
              </FormControl>
              <FormDescription>This is room's public name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Capacity</FormLabel>
              <FormControl>
                <Input placeholder="Example: 10" type="number" {...field} />
              </FormControl>
              <FormDescription>
                This is maximum number of participants.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="votingSystem"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Voting System</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      role="combobox"
                      variant="combobox"
                      className={cn(!field.value && "text-muted-foreground")}
                    >
                      {field.value
                        ? votingSystems.find(
                            (system) => system.value === field.value,
                          )?.label
                        : "Select language"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[100vw] max-w-[36rem] p-0">
                  <Command>
                    {/* <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandEmpty>No framework found.</CommandEmpty> */}
                    <CommandList>
                      <CommandGroup>
                        {votingSystems.map((system) => (
                          <CommandItem
                            value={system.label}
                            key={system.value}
                            onSelect={() => {
                              form.setValue("votingSystem", system.value);

                              setOpen(false);
                            }}
                          >
                            {system.label}

                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                system.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormDescription>
                This is the voting system for specifying estimations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create room</Button>
      </form>
    </Form>
  );
}
