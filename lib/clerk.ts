import React from "react";
import * as ClerkReal from "@clerk/clerk-expo";
import { ConvexProvider } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
export const isDummyKey = !EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("dummy") || 
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_test_ZHVtbXk");

export const ClerkProvider = isDummyKey 
  ? function MockClerkProvider({ children }: { children: React.ReactNode }) {
      return React.createElement(React.Fragment, null, children);
    }
  : ClerkReal.ClerkProvider;

let dummyIsSignedIn = false;

export const useAuth = isDummyKey 
  ? () => ({
      isLoaded: true,
      get isSignedIn() { return dummyIsSignedIn; },
      get userId() { return dummyIsSignedIn ? 'mock-user-id' : null; },
      get sessionId() { return dummyIsSignedIn ? 'mock-session-id' : null; },
      getToken: async () => null,
      signOut: async () => { dummyIsSignedIn = false; },
    })
  : ClerkReal.useAuth;

export const useUser = isDummyKey
  ? () => ({
      isLoaded: true,
      get isSignedIn() { return dummyIsSignedIn; },
      user: dummyIsSignedIn ? {
        id: 'mock-user-id',
        firstName: 'User',
        lastName: '',
        fullName: 'User',
        primaryEmailAddress: { emailAddress: 'user@example.com' },
        imageUrl: null,
      } : null,
    })
  : ClerkReal.useUser;

export const useSignIn = isDummyKey 
  ? () => ({
      isLoaded: true,
      signIn: {
        create: async () => ({
          status: "complete",
          createdSessionId: "mock-session-id",
        }),
      },
      setActive: async () => { dummyIsSignedIn = true; },
    })
  : ClerkReal.useSignIn;

export const useSignUp = isDummyKey 
  ? () => ({
      isLoaded: true,
      signUp: {
        create: async () => ({
          status: "complete",
          createdSessionId: "mock-session-id",
          createdUserId: "mock-user-id",
        }),
        prepareEmailAddressVerification: async () => {},
        attemptEmailAddressVerification: async () => ({
          status: "complete",
          createdSessionId: "mock-session-id",
          createdUserId: "mock-user-id",
        }),
      },
      setActive: async () => { dummyIsSignedIn = true; },
    })
  : ClerkReal.useSignUp;

export const useOAuth = isDummyKey
  ? () => ({
      startOAuthFlow: async () => {
        dummyIsSignedIn = true;
        return {
          createdSessionId: "mock-session-id",
          setActive: async () => { dummyIsSignedIn = true; },
        };
      },
    })
  : ClerkReal.useOAuth;

export const AppConvexProvider = isDummyKey 
  ? function MockConvexProvider({ children, client }: { children: React.ReactNode, client: any }) {
      return React.createElement(ConvexProvider, { client }, children);
    }
  : function RealConvexProvider({ children, client, useAuth: uAuth }: { children: React.ReactNode, client: any, useAuth: any }) {
      return React.createElement(ConvexProviderWithClerk, { client, useAuth: uAuth }, children);
    };
