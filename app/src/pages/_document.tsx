import Header from "@/components/Header";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <GoogleOAuthProvider clientId="598740964972-76kkdmfnmgu1b3082k3klf5k5i1jscmo.apps.googleusercontent.com">
          <Header />
          <Main />
          <NextScript />
        </GoogleOAuthProvider>
      </body>
    </Html>
  );
}
