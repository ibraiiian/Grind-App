import React from "react";
import * as ClerkReal from "@clerk/clerk-expo";
import { ConvexProvider } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
const isDummyKey = !EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("dummy") || 
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_test_ZHVtbXk");

export const ClerkProvider = isDummyKey 
  ? function MockClerkProvider({ children }: { children: React.ReactNode }) {
      return React.createElement(React.Fragment, null, children);
    }
  : ClerkReal.ClerkProvider;

export const useAuth = isDummyKey 
  ? () => ({
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      sessionId: null,
      getToken: async () => null,
      signOut: async () => {},
    })
  : ClerkReal.useAuth;

export const useSignIn = isDummyKey 
  ? () => ({
      isLoaded: true,
      signIn: {
        create: async () => ({
          status: "complete",
          createdSessionId: "mock-session-id",
        }),
      },
      setActive: async () => {},
    })
  : ClerkReal.useSignIn;

export const useSignUp = isDummyKey 
  ? () => ({
      isLoaded: true,
      signUp: {
        create: async () => ({
          status: "complete",
          createdSessionId: "mock-session-id",
        }),
        prepareEmailAddressVerification: async () => {},
        attemptEmailAddressVerification: async () => ({
          status: "complete",
          createdSessionId: "mock-session-id",
        }),
      },
      setActive: async () => {},
    })
  : ClerkReal.useSignUp;

export const useOAuth = isDummyKey
  ? () => ({
      startOAuthFlow: async () => ({
        createdSessionId: "mock-session-id",
        setActive: async () => {},
      }),
    })
  : ClerkReal.useOAuth;

export const AppConvexProvider = isDummyKey 
  ? function MockConvexProvider({ children, client }: { children: React.ReactNode, client: any }) {
      return React.createElement(ConvexProvider, { client }, children);
    }
  : function RealConvexProvider({ children, client, useAuth: uAuth }: { children: React.ReactNode, client: any, useAuth: any }) {
      return React.createElement(ConvexProviderWithClerk, { client, useAuth: uAuth }, children);
    };
