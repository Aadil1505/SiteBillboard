import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({
  server: "sandbox",
  accessToken: process.env.POLAR_ACCESS_TOKEN,
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            // Production Subdomain Product
            // {
            //     productId: "47d08c78-92bf-4ceb-afa4-7caf3b376a07",
            //     slug: "Subdomain-Rental" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Subdomain-Rental
            // }

            // Sandbox Subdomani Product
            {
              productId: "c6febc16-7929-4a0e-bf38-55ca11b9bf87",
              slug: "Subdomain-Rental", // Custom slug for easy reference in Checkout URL, e.g. /checkout/Subdomain-Rental
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
      ],
    }),
    nextCookies(),
  ], // make sure this is the last plugin in the array
});
