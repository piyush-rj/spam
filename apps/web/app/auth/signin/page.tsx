"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Caveat } from "next/font/google";

const caveat = Caveat({ weight: "600" });

export default function SignIn()  {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl  hover:scale-105 transition-all transform duration-300">

        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-6 left-6 w-16 h-16 rounded-full border-4 border-white"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full border-4 border-white"></div>
          </div>
          <div className="relative z-10 text-center">
            <h1 className={`${caveat.className} text-4xl font-bold mb-2`}>Welcome</h1>
            <p className="text-gray-100 text-lg">Sign in to continue</p>
          </div>
        </div>

        <div className="bg-gray-800 p-8 space-y-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-4 bg-gray-700 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-orbit-icon lucide-orbit"><path d="M20.341 6.484A10 10 0 0 1 10.266 21.85"/><path d="M3.659 17.516A10 10 0 0 1 13.74 2.152"/><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/></svg>
            </div>
            <p className="text-gray-300">Connect with people all around the world</p>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all font-medium shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-3 bg-gradient-to-r from-gray-700 to-gray-600 transition-all duration-300 ease-out group-hover:w-full opacity-10"></div>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="pt-4 text-center">
            <p className="text-gray-400 text-sm">
              By signing in, you agree to our 
              <a href="#" className="text-yellow-500 hover:text-yellow-400 ml-1">Terms of Service</a>
            </p>
          </div>
        </div>

        <div className="bg-gray-900 p-4 text-center">
          <p className="text-gray-500 text-sm">
            Need help? <a href="https://github.com/piyush-rj" className="text-yellow-500 hover:text-yellow-400 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
  );
}