"use client";

import { useAuthStore, Role } from "@/store/useAuthStore";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

// Define types for the session response
type KindeSessionResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    imageUrl: string;
    role: string;
  } | null;
  authenticated: boolean;
  error?: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setAuthenticated, setLoading, setError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const getKindeSession = async () => {
      setIsLoading(true);
      setLocalError(null);
      setLoading(true);
      setError(null);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch("/api/kindeSession", {
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: KindeSessionResponse = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.user) {
          // Transform Kinde user data to match your structure
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            imageUrl: data.user.imageUrl,
            role: (data.user.role as Role) || Role.User, // Default to User if no role is provided
          });
        } else {
          setUser(null);
        }
        setAuthenticated(data.authenticated);
        console.log("Kinde session fetched successfully");

      } catch (error) {
        let errorMessage = "Failed to fetch Kinde session";

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorMessage = "Request timeout - please check your connection";
          } else {
            errorMessage = error.message;
          }
        }

        console.error(errorMessage, error);
        setLocalError(errorMessage);
        setError(errorMessage);

        // Reset auth state on error
        setUser(null);
        setAuthenticated(false);

      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    // Retry logic for failed requests
    const retryWithBackoff = async (maxRetries: number = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          await getKindeSession();
          break;
        } catch (error) {
          if (i === maxRetries - 1) throw error;
          const backoffTime = Math.min(1000 * Math.pow(2, i), 5000);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    };

    retryWithBackoff().catch(error => {
      console.error("All retry attempts failed:", error);
      setLocalError("Failed to establish authentication after multiple attempts");
      setError("Failed to establish authentication after multiple attempts");
    });

    // Cleanup function
    return () => {
      setUser(null);
      setAuthenticated(false);
    };
  }, [setUser, setAuthenticated, setLoading, setError]);

  // Error boundary
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600">Authentication Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <KindeProvider>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : (
        children
      )}
    </KindeProvider>
  );
};