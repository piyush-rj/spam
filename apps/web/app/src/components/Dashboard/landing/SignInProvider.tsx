"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import SignIn from "../../../../auth/signin/page";

const SignInModalContext = createContext({
  open: () => {},
  close: () => {},
});

export const useSignInModal = () => useContext(SignInModalContext);

export const SignInModalProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <SignInModalContext.Provider value={{ open, close }}>
      {children}
      {visible && (
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={close}
              className="absolute top-2 right-2 z-10 text-white bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded"
            >
              ✕
            </button>
            <SignIn />
          </div>
        </div>
      )}
    </SignInModalContext.Provider>
  );
};
