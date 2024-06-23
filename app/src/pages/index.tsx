// pages/index.tsx
import { useState } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import WalletExpense from "@/components/WalletExpense";

export default function Home() {
  const [email, setEmail] = useState<string>("");

  const handleLogin = (email: string) => {
    setEmail(email);
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        {email ? (
          <>
            <div className="flex items-center h-10 mb-4">
              <div className="left flex-grow">
                <div className="text-2xl">{`${email.slice(
                  0,
                  5
                )}...${email.slice(-8)}`}</div>
              </div>
              <div className="right">
                <button
                  onClick={() => setEmail("")}
                  className="bg-gray-100 px-4 py-2 rounded-full"
                >
                  Sign out
                </button>
              </div>
            </div>
            <WalletExpense email={email} />
            <div className="mt-6 text-center">
              <div className="mx-auto w-fit px-4 bg-gray-100 rounded-full border cursor-pointer">
                Switch other wallets
              </div>
            </div>
          </>
        ) : (
          <div className="text-center mb-4">
            <div className="text-4xl">Suica Wallet</div>
            <div className="h-10"></div>
            <div className="text-left">
              <GoogleLoginButton onLogin={handleLogin} />
              <div className="mt-4">
                <span>
                  Please login your gmail account to access the wallet
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
