import "@fontsource-variable/geist";
import { ClerkProvider, useAuth, SignInButton, UserButton } from "@clerk/react";
import { deDE } from "@clerk/localizations/de-DE";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminCopy } from "~/content/admin.de";

import "./admin.css";

type AdminProfile = {
  clerkUserId: string;
  role: "owner" | "staff";
  active: boolean;
  displayName: string;
};

type AccessState =
  | { status: "loading" }
  | { status: "authorized"; profile: AdminProfile }
  | { status: "denied" }
  | { status: "unavailable" };

export function AdminEntry() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  useEffect(() => {
    const previousTitle = document.title;
    const existingRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = existingRobots?.content;
    const robots = existingRobots ?? document.head.appendChild(document.createElement("meta"));
    robots.name = "robots";
    robots.content = "noindex, nofollow, noarchive";
    document.title = adminCopy.title;

    return () => {
      document.title = previousTitle;
      if (existingRobots && previousRobots !== undefined) existingRobots.content = previousRobots;
      else robots.remove();
    };
  }, []);

  if (!publishableKey) {
    return (
      <main className="admin-configuration" id="main-content">
        <p>{adminCopy.configuration.kicker}</p>
        <h1>{adminCopy.configuration.title}</h1>
        <p>{adminCopy.configuration.body}</p>
        <Link to="/$lang" params={{ lang: "de" }} search={{}}>{adminCopy.backToRestaurant}</Link>
      </main>
    );
  }

  return <ClerkProvider publishableKey={publishableKey} localization={deDE}><AdminPage /></ClerkProvider>;
}

export function AdminPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [access, setAccess] = useState<AccessState>({ status: "loading" });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setAccess({ status: "loading" });
      return;
    }

    const controller = new AbortController();
    void getToken().then(async (token) => {
      const response = await fetch("/api/admin/me", {
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
        signal: controller.signal,
      });

      if (response.ok) {
        const body = await response.json() as { userId: string; role: "owner" | "staff"; displayName: string };
        setAccess({ status: "authorized", profile: { clerkUserId: body.userId, role: body.role, active: true, displayName: body.displayName } });
      } else if (response.status === 401 || response.status === 403) {
        setAccess({ status: "denied" });
      } else {
        setAccess({ status: "unavailable" });
      }
    }).catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) setAccess({ status: "unavailable" });
    });

    return () => controller.abort();
  }, [getToken, isLoaded, isSignedIn]);

  return (
    <main className="admin-shell" id="main-content">
      <section className="admin-visual" aria-hidden="true">
        <img src="/images/colosseo/interior-dining-room.webp" alt="" />
        <div className="admin-visual-wash" />
        <p>Ristorante Colosseo</p>
      </section>
      <section className="admin-access" aria-labelledby="admin-title">
        <div className="admin-access-topline">
          <Link to="/$lang" params={{ lang: "de" }} search={{}}>{adminCopy.backToWebsite}</Link>
          {isSignedIn ? <UserButton /> : null}
        </div>

        {!isLoaded ? <Status {...adminCopy.loading} /> : null}

        {isLoaded && !isSignedIn ? (
          <div className="admin-copy">
            <p className="admin-kicker">{adminCopy.signedOut.kicker}</p>
            <h1 id="admin-title">{adminCopy.signedOut.title}</h1>
            <p>{adminCopy.signedOut.body}</p>
            <SignInButton mode="modal">
              <button className="admin-primary" type="button">{adminCopy.signedOut.action}</button>
            </SignInButton>
          </div>
        ) : null}

        {isLoaded && isSignedIn && access.status === "loading" ? <Status {...adminCopy.checking} /> : null}
        {isLoaded && isSignedIn && access.status === "denied" ? <Status {...adminCopy.denied} /> : null}
        {isLoaded && isSignedIn && access.status === "unavailable" ? <Status {...adminCopy.unavailable} /> : null}
        {isLoaded && isSignedIn && access.status === "authorized" ? (
          <div className="admin-copy">
            <p className="admin-kicker">{adminCopy.authorized.kicker}</p>
            <h1 id="admin-title">{adminCopy.authorized.greeting(access.profile.displayName)}</h1>
            <p>{adminCopy.authorized.body}</p>
            <div className="admin-module-list" aria-label={adminCopy.authorized.modulesLabel}>
              {adminCopy.authorized.modules.map((module) => <span key={module}>{module}</span>)}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Status({ title, body }: { title: string; body: string }) {
  return <div className="admin-copy" role="status"><p className="admin-kicker">{adminCopy.statusKicker}</p><h1 id="admin-title">{title}</h1><p>{body}</p></div>;
}
