import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL! || "http://localhost:3000",
  plugins: [polarClient()],
});

export const signInWithGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};

export const checkoutProduct = async () => {
  const data = await authClient.checkout({
    // Polar Product IDs
    // products: ["e651f46d-ac20-4f26-b769-ad088b123df2"],
    products: ["e651f46d-ac20-4f26-b769-ad088b123df2"],
    // OR
    // if "products" in passed in the checkout plugin's config, you may pass the slug
    // slug: "pro",
  });
};
