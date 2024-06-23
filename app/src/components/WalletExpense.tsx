// pages/index.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import QRCode from "qrcode.react";

export default function WalletExpense({ email }: { email: string }) {
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(5);
  const [asset, setAsset] = useState<string>("usdt");
  const [expIn, setExpIn] = useState<number>(5);
  const [expDate, setExpDate] = useState<number>(
    Math.floor(Date.now() / 1000) + 5 * 60
  );
  const [signature, setSignature] = useState<string>("");
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const dummyAddresses: { [key: string]: string } = {
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    jpy: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  };

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    setExpDate(now + expIn * 60);

    // Generate wallet address on component mount
    generateWalletAddress();
  }, [email]);

  const generateWalletAddress = async () => {
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(email)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const walletInstance = new ethers.Wallet(hashHex);
    setWallet(walletInstance);
    setWalletAddress(walletInstance.address);
  };

  useEffect(() => {
    if (amount && asset && walletAddress) {
      signMessage();
    }
  }, [amount, asset, expDate]);

  const signMessage = async () => {
    if (!asset) {
      alert("Please select an asset.");
      return;
    }

    if (!amount) {
      alert("Please enter an amount.");
      return;
    }

    const _assetAddress = dummyAddresses[asset];

    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "uint256"],
      [_assetAddress, amount, expDate]
    );

    if (wallet) {
      const signature = await wallet.signMessage(ethers.toBeArray(messageHash));
      setSignature(signature);
    } else {
      alert("Wallet not initialized");
    }
  };

  const jsonData = {
    amount: amount,
    asset: dummyAddresses[asset],
    expDate: expDate,
    signature: signature,
  };

  return (
    <>
      <div className="flex items-center border-b-4 border-orange-500 justify-around">
        <div
          className={`cursor-pointer w-1/2 py-2 h-full text-center ${
            showWallet ? "bg-gray-100" : "bg-orange-500 text-white"
          }`}
          onClick={() => {
            setShowWallet(false);
          }}
        >
          QrPay
        </div>
        <div
          className={`cursor-pointer w-1/2 py-2 h-full text-center ${
            showWallet ? "bg-orange-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => {
            setShowWallet(true);
          }}
        >
          Show Wallet
        </div>
      </div>
      {showWallet && (
        <>
          {walletAddress && (
            <div id="qrcode" className="py-6">
              <QRCode
                value={walletAddress}
                className="mx-auto"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
          <div className="p-4 bg-gray-100 break-all rounded">
            {walletAddress}
          </div>
        </>
      )}
      {!showWallet && (
        <div>
          {signature && (
            <div id="qrcode" className="py-6">
              <QRCode
                value={JSON.stringify(jsonData)}
                className="mx-auto"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}

          <input
            type="number"
            id="amount"
            name="amount"
            className="h-16 border-2 rounded-lg outline-none border-orange-500 text-4xl px-4 w-full mb-4"
            placeholder="50USDT"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />

          <div className="text text-gray-400 mb-1">Asset:</div>
          <div className="flex justify-around space-x-4 mb-4">
            <button
              onClick={() => setAsset("usdt")}
              className={`w-full h-10 px-4 rounded-full  ${
                asset == "usdt"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              USDT
            </button>
            <button
              onClick={() => setAsset("usdc")}
              className={`w-full px-4 rounded-full  ${
                asset == "usdc"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              USDC
            </button>
            <button
              onClick={() => setAsset("jpy")}
              className={`w-full px-4 rounded-full  ${
                asset == "jpy"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              JPY
            </button>
          </div>
          <div className="text text-gray-400 mb-1">Expired in</div>
          <div className="flex justify-around space-x-4">
            <button
              onClick={() => setExpIn(5)}
              className={`w-full px-4 rounded-full  ${
                expIn == 5
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              5 mins
            </button>
            <button
              onClick={() => setExpIn(15)}
              className={`w-full px-4 rounded-full  ${
                expIn == 15
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              15 mins
            </button>
            <button
              onClick={() => setExpIn(60)}
              className={`w-full px-4 rounded-full  ${
                expIn == 60
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              1 hour
            </button>
          </div>
        </div>
      )}
    </>
  );
}
