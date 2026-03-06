import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Apply migration on upgrade

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type WaitlistEntry = {
    name : Text;
    company : ?Text;
    email : Text;
    joinedAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  let entries = Map.empty<Text, WaitlistEntry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Add new entry to waitlist - requires user role
  public shared ({ caller }) func addEntry(name : Text, company : ?Text, email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join the waitlist");
    };

    switch (entries.get(email)) {
      case (null) {
        let newEntry : WaitlistEntry = {
          name;
          company;
          email;
          joinedAt = Time.now();
        };
        entries.add(email, newEntry);
      };
      case (?_) {
        Runtime.trap("Email has already joined the waitlist");
      };
    };
  };

  // Public query - no authorization needed
  public query ({ caller }) func getWaitlistCount() : async Nat {
    entries.size();
  };

  // Public query - returns whether an admin has been initialized
  public query ({ caller }) func isOwnerSet() : async Bool {
    // Check if there's at least one admin in the system
    AccessControl.hasPermission(accessControlState, caller, #admin) or
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Public query - for compatibility, returns null (role-based system doesn't have single owner)
  public query ({ caller }) func getOwner() : async ?Principal {
    // In role-based system, there's no single owner
    // This is kept for API compatibility but returns null
    null;
  };

  // Admin-only method to get all entries
  public query ({ caller }) func getAllEntries() : async [WaitlistEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all entries");
    };
    entries.values().toArray();
  };

  // Note: setOwner() is removed - use the initialize() function from MixinAuthorization
  // The first caller to initialize() becomes an admin
};
