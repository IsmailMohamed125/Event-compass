import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) await ensureProfile(session.user);
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await ensureProfile(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Ensure a profile exists for the user (for both email and OAuth sign-in)
  const ensureProfile = async (user) => {
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email,
      avatar_url: user.user_metadata?.avatar_url || null,
      role: "user",
    });
  };

  const signUp = (data) => supabase.auth.signUp(data);
  const signIn = (data) => supabase.auth.signInWithPassword(data);
  const signOut = () => supabase.auth.signOut();
  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: "google" });

  const value = {
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
