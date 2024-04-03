"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { RoomApi } from "@/api/room-api";

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

const votingSystems = [
  {
    system: VOTING_SYSTEM.FIBONACCI,
    label: "Fibonacci (0, 1, 2, 3, 5, 8, ...)",
    value: VOTING_SYSTEM.FIBONACCI,
  },
  {
    system: VOTING_SYSTEM.TSHIRTS,
    label: "T-shirts (XS, S, M, L, XL, ...)",
    value: VOTING_SYSTEM.TSHIRTS,
  },
] as const;

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Room's name must be at least 6 characters.",
  }),

  votingSystem: z.string({
    required_error: "Please select a voting system",
  }),

  roomCapacity: z.coerce
    .number()
    .min(2, { message: "Room capacity must be at least 2" })
    .max(20, { message: "Room capacity must be at most 20" }),
});

export default function CreateForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      votingSystem: VOTING_SYSTEM.FIBONACCI,
      roomCapacity: 10,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const room: any = {
      name: values.username,
      capacity: values.roomCapacity,
      votingSystem: values.votingSystem
    };
    
    RoomApi.createRoom(room);
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
