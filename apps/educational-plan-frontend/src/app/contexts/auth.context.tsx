import { AuthResponse, IUser } from "@educational-plan/types";
import React, { useEffect } from "react";
import { apiCall } from "../lib/utils";

export const AuthContext = React.createContext<IAuthContext>({} as IAuthContext);
export const useAuth = () => React.useContext(AuthContext);

export interface AuthState {
  isLoading: boolean;
  token: string | null;
  user: IUser | null;
}

export interface IAuthContext {
  signIn: (authResponse: AuthResponse) => void;
  signOut: () => void;
  state: AuthState;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    isLoading: true,
    token: null,
    user: null,
  });

  const signIn = (authResponse: AuthResponse) => {
    setState({
      isLoading: false,
      token: authResponse.accessToken,
      user: authResponse.user,
    });
    localStorage.setItem("token", authResponse.accessToken);
  }

  const signOut = () => {
    setState({
      isLoading: false,
      token: null,
      user: null,
    });
    localStorage.removeItem("token");
  }

  useEffect(() => {
    restoreTokens();
  }, []);

  async function restoreTokens() {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const user = await apiCall<IUser>("auth/user", "GET");
        setState({
          isLoading: false,
          token,
          user,
        });
      } catch (error) {
        setState({
          isLoading: false,
          token: null,
          user: null,
        });
        localStorage.removeItem("token");
      }
    } else {
      setState({
        isLoading: false,
        token: null,
        user: null,
      });
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, state }}>
      {children}
    </AuthContext.Provider>
  );
}
