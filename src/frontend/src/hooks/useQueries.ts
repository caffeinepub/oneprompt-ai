import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WaitlistEntry } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

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
    mutationFn: async ({
      name,
      company,
      email,
    }: {
      name: string;
      company: string | null;
      email: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addEntry(name, company, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlistCount"] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAllEntries(enabled: boolean) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<WaitlistEntry[]>({
    queryKey: ["allEntries", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching && !!identity && enabled,
  });
}
