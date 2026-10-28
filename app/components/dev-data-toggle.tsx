import { useSearchParams } from "react-router";

const states = ["demo", "worst", "empty", "one"] as const;
export type DataState = (typeof states)[number];

export function useDataState(): DataState {
  const [params] = useSearchParams();
  const state = params.get("data");
  return states.includes(state as DataState) ? (state as DataState) : "demo";
}

export function DevDataToggle() {
  const [params, setParams] = useSearchParams();
  const active = useDataState();

  if (!import.meta.env.DEV) return null;

  return (
    <div className="dev-data-toggle" aria-label="Testdaten wählen">
      {states.map((state) => (
        <button
          aria-pressed={active === state}
          key={state}
          onClick={() => {
            const next = new URLSearchParams(params);
            if (state === "demo") next.delete("data");
            else next.set("data", state);
            setParams(next, { replace: true });
          }}
          type="button"
        >
          {state === "demo" ? "Demo" : state === "worst" ? "Worst case" : state === "empty" ? "Empty" : "One"}
        </button>
      ))}
    </div>
  );
}
