import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WaitlistEntry {
    name: string;
    joinedAt: Time;
    email: string;
    company?: string;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEntry(name: string, company: string | null, email: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllEntries(): Promise<Array<WaitlistEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOwner(): Promise<Principal | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWaitlistCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    isOwnerSet(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
