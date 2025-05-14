"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#141414]/30 backdrop-blur-md border border-purple-600 rounded-2xl shadow-xl overflow-hidden">
      
        <div className="bg-gradient-to-r from-purple-700 to-cyan-500 py-6 text-center text-white">
          <h1 className="text-3xl font-extrabold">Welcome</h1>
          <p className="mt-1 text-sm text-gray-200">Sign in to your account</p>
        </div>

        <div className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/10 border border-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#gradientStroke)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`lucide lucide-orbit-icon lucide-orbit ${isLoading ? 'animate-spin' : ''}`}
              >
                <defs>
                  <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <path d="M20.341 6.484A10 10 0 0 1 10.266 21.85" />
                <path d="M3.659 17.516A10 10 0 0 1 13.74 2.152" />
                <circle cx="12" cy="12" r="3" />
                <circle cx="19" cy="5" r="2" />
                <circle cx="5" cy="19" r="2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 px-4 rounded-lg hover:bg-gray-100 transition-all font-medium shadow-md relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-3 bg-gradient-to-r from-purple-600 to-cyan-400 group-hover:w-full transition-all duration-300 ease-out opacity-10"></div>
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.261 7.30904H8.93404V10.76H13.726C13.28 12.953 11.413 14.213 8.93404 14.213C8.24038 14.2142 7.5533 14.0785 6.91222 13.8135C6.27114 13.5486 5.68868 13.1597 5.19823 12.6691C4.70778 12.1786 4.31899 11.5961 4.05418 10.9549C3.78936 10.3138 3.65372 9.6267 3.65504 8.93304C3.65386 8.23946 3.78959 7.55246 4.05447 6.91145C4.31934 6.27044 4.70814 5.68801 5.19858 5.19758C5.68902 4.70714 6.27144 4.31834 6.91245 4.05346C7.55347 3.78859 8.24046 3.65285 8.93404 3.65404C10.193 3.65404 11.331 4.10104 12.224 4.83204L14.824 2.23304C13.24 0.852038 11.209 3.80581e-05 8.93404 3.80581e-05C7.75985 -0.00339412 6.59656 0.225348 5.51109 0.673108C4.42562 1.12087 3.43938 1.77881 2.6091 2.60909C1.77881 3.43938 1.12087 4.42562 0.673111 5.51109C0.225351 6.59656 -0.00339112 7.75985 4.10512e-05 8.93404C-0.00352385 10.1083 0.225128 11.2716 0.67284 12.3571C1.12055 13.4427 1.77849 14.429 2.6088 15.2593C3.43911 16.0896 4.4254 16.7475 5.51093 17.1952C6.59647 17.643 7.75981 17.8716 8.93404 17.868C13.401 17.868 17.463 14.619 17.463 8.93404C17.463 8.40604 17.382 7.83704 17.261 7.30904Z" fill="black"/>
                </svg>


                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-4 text-center">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-300 underline transition"
            >
              Terms of Service
            </a>
          </p>
        </div>

        <div className="bg-[#141414]/30 py-4 text-center border-t border-gray-700 text-sm text-gray-500">
          Need help?{" "}
          <a
            href="https://github.com/piyush-rj"
            className="text-purple-400 hover:text-purple-300 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
