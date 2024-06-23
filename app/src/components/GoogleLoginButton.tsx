// components/GoogleLoginButton.tsx
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface GoogleLoginButtonProps {
  onLogin: (email: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onLogin }) => {
  const handleCredentialResponse = (response: any) => {
    const decodedToken: { email: string } = jwtDecode(response.credential);
    onLogin(decodedToken.email);
  };

  return (
    <GoogleOAuthProvider clientId="598740964972-76kkdmfnmgu1b3082k3klf5k5i1jscmo.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleCredentialResponse}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
