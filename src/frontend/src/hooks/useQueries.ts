import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useWaitlistCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["waitlistCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getWaitlistCount();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAddEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addEntry(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlistCount"] });
    },
  });
}
