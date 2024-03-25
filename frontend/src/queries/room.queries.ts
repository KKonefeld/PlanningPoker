import { RoomApi } from "@/api/room-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const roomKeys = {
  rooms: () => ["rooms", "list"],
  room: (roomId: number) => ["room", roomId],
};

export function useRoomsListQuery() {
  const query = useQuery({
    queryKey: roomKeys.rooms(),
    queryFn: RoomApi.getRooms,
  });
  return query;
}

export function useRoomDetailsQuery(roomId: number) {
  const query = useQuery({
    queryKey: roomKeys.room(roomId),
    queryFn: () => RoomApi.getRoom(roomId),
  });
  return query;
}

export function useCreateRoomMutation(options: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: RoomApi.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.rooms() });
      options.onSuccess?.();
    },
    onError: () => {
      options.onError?.();
    },
  });
  return mutation;
}

export function useJoinRoomMutation(options: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const mutation = useMutation({
    mutationFn: RoomApi.joinRoom,
    onSuccess: () => {
      options.onSuccess?.();
    },
    onError: () => {
      options.onError?.();
    },
  });
  return mutation;
}

export function useLeaveRoomMutation(options: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const mutation = useMutation({
    mutationFn: RoomApi.leaveRoom,
    onSuccess: () => {
      options.onSuccess?.();
    },
  });
  return mutation;
}
