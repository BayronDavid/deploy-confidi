'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (provider) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-buttons">
      <button 
        onClick={() => handleLogin('google')}
        disabled={isLoading}
        className="login-button google"
      >
        {isLoading ? 'Loading...' : 'Sign in with Google'}
      </button>
      <button 
        onClick={() => handleLogin('github')}
        disabled={isLoading}
        className="login-button github"
      >
        {isLoading ? 'Loading...' : 'Sign in with GitHub'}
      </button>
    </div>
  );
}
