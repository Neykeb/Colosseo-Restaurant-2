import { Show, SignInButton, UserButton } from "@clerk/react";

export function ClerkAuthControls() {
  return (
    <div className="clerk-auth-controls" aria-label="Admin-Anmeldung">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="clerk-sign-in" type="button">Admin anmelden</button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
