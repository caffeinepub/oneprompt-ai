import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface WaitlistEntry {
    joinedAt: Time;
    email: string;
}
export interface backendInterface {
    addEntry(email: string): Promise<void>;
    getAllEntries(): Promise<Array<WaitlistEntry>>;
    getWaitlistCount(): Promise<bigint>;
}
