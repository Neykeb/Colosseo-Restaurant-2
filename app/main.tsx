import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

const root = document.getElementById("root")!;
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is missing. Run `clerk env pull` for local development.");
}

if (root.hasAttribute("data-prerendered")) root.replaceChildren();

createRoot(root).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
);
