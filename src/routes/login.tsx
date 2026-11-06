import { createFileRoute } from "@tanstack/react-router"
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client"

export const Route = createFileRoute("/login")({ component: Login })

function Login() {
  return (
    <main className="page grid min-h-screen content-center py-16 text-parchment">
      <div className="w-full max-w-sm">
        <p className="eyebrow">Hearthforge</p>
        <h1 className="page-title">Sign in</h1>
        <p className="lead">Sign in with Google to keep saved crafts on your account.</p>
        <div className="mt-8 grid gap-3">
        {authEnabled ? (
          GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
              className="h-11 w-full rounded-lg border border-line bg-panel text-sm text-parchment"
            >
              Continue with {provider.label}
            </button>
          ))
        ) : (
          <p className="text-sm text-muted">Sign-in is turned off.</p>
        )}
        </div>
      </div>
    </main>
  )
}
