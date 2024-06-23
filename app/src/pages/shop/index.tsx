import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const Home = () => {
  const [data, setData] = useState<{
    amount: number;
    asset: string;
    expDate: number;
    signature: string;
  } | null>();

  function successHandler(data: any) {
    try {
      const qrContent = JSON.parse(data);
      console.log(qrContent);
      setData(qrContent);
    } catch (error) {
      setData(null);
    }
  }

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center py-6 mt-12 max-w-md mx-auto">
      <div className="max-w-md">
        <Scanner
          onScan={(result) => {
            successHandler(result[0].rawValue);
          }}
        />
      </div>
      {data && (
        <div className="overflow-hidden max-w-md">
          <pre className="break-word overflow-hidden" id="json">
            {JSON.stringify(data, null, 4)}
          </pre>
        </div>
      )}

      {data ? (
        <div className="p-4 rounded-full bg-orange-300 mt-4 cursor-pointer">
          Collect
        </div>
      ) : (
        <>Scan</>
      )}
    </div>
  );
};

export default Home;
