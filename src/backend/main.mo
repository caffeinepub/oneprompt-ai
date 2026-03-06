import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

actor {
  type WaitlistEntry = {
    email : Text;
    joinedAt : Time.Time;
  };

  let entries = Map.empty<Text, WaitlistEntry>();

  func isAdmin(caller : Principal) : Bool {
    // Anonymous principal is the admin during local development only
    caller.isAnonymous();
  };

  public shared ({ caller }) func addEntry(email : Text) : async () {
    if (entries.containsKey(email)) {
      Runtime.trap("Email has already joined the waitlist");
    };

    let entry : WaitlistEntry = {
      email;
      joinedAt = Time.now();
    };
    entries.add(email, entry);
  };

  public query ({ caller }) func getWaitlistCount() : async Nat {
    entries.size();
  };

  public query ({ caller }) func getAllEntries() : async [WaitlistEntry] {
    if (not isAdmin(caller)) {
      Runtime.trap("Only admin can access all waitlist entries");
    };
    entries.values().toArray();
  };
};
