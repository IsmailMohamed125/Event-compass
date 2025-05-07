import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth loading timeout reached - forcing render");
        setLoading(false);
      }
    }, 5000);

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            await ensureProfile(session.user);
          } catch (profileError) {
            console.error(
              "Failed to ensure profile, but continuing:",
              profileError
            );
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError(err);
      } finally {
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {

        if (event === "SIGNED_OUT") {
          setUser(null);
          return;
        }

        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            await ensureProfile(session.user);
          } catch (profileError) {
            console.error(
              "Failed to ensure profile on auth change:",
              profileError
            );
          }
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError(err);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  const ensureProfile = async (user) => {
    if (!user?.id) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email,
      avatar_url: user.user_metadata?.avatar_url || null,
      role: "user",
    });

    if (error) throw error;
  };


  const signUp = async (data) => {
    const response = await supabase.auth.signUp(data);
    return response;
  };

  const signIn = (data) => supabase.auth.signInWithPassword(data);

  
  const signOut = async () => {
    
    setUser(null);

   
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during sign out:", error);

      return { error };
    }
  };

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: "google" });

  const value = {
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    user,
    loading,
    error,
  };

  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading authentication...</p>
        </div>
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
