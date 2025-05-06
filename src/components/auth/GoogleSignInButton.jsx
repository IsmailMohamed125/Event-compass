import { useState } from "react";
import { supabase } from "../../lib/supabase";

const GoogleSignInButton = ({ onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error && onError) onError(error.message);
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition"
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <g>
          <path
            fill="#4285F4"
            d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.77 0 24 0 14.82 0 6.71 5.1 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.36 46.1 31.44 46.1 24.55z"
          />
          <path
            fill="#FBBC05"
            d="M9.67 28.64c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C-1.13 17.1-1.13 30.9 1.69 37.56l7.98-6.2z"
          />
          <path
            fill="#EA4335"
            d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.19-5.6c-2.01 1.35-4.6 2.15-8.7 2.15-6.38 0-11.87-3.63-13.33-8.94l-7.98 6.2C6.71 42.9 14.82 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </g>
      </svg>
      {loading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default GoogleSignInButton;
