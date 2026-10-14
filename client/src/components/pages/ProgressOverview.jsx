/* eslint-disable react/prop-types */
import { formatWeight, toDisplayWeight, unitLabel } from "../../utils/workout-display";
import { convertUtcToDateFormat } from "../../utils/date-formatter";

const Stat = ({ label, value, sub }) => (
  <div className="rounded-lg border border-base-300 bg-base-100 p-3">
    <div className="text-[0.65rem] font-bold uppercase tracking-wide opacity-50">
      {label}
    </div>
    <div className="text-lg font-bold">{value}</div>
    {sub && <div className="text-xs opacity-60">{sub}</div>}
  </div>
);

const compactWeight = (lb, unit) => {
  const n = toDisplayWeight(lb, unit);
  return n >= 1000
    ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
    : `${Math.round(n)}`;
};

// A ranked list of exercises. onSelect jumps straight into that exercise's
// detail view, so the overview doubles as navigation.
const Ranked = ({ title, caption, items, render, onSelect, empty }) => (
  <div className="mb-6">
    <h2 className="text-sm font-bold uppercase tracking-wide opacity-50">
      {title}
    </h2>
    {caption && <p className="mb-2 mt-1 text-xs opacity-60">{caption}</p>}
    {items.length === 0 ? (
      <div className="rounded-lg border border-dashed p-4 text-center text-sm opacity-60">
        {empty}
      </div>
    ) : (
      <div className="mt-2 flex flex-col gap-1">
        {items.map((e) => (
          <button
            key={e.userWorkoutId}
            onClick={() => onSelect(e.userWorkoutId)}
            className="flex items-center justify-between gap-2 rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-left transition hover:border-primary"
          >
            <span className="min-w-0 truncate text-sm font-medium">{e.name}</span>
            <span className="flex-none text-xs">{render(e)}</span>
          </button>
        ))}
      </div>
    )}
  </div>
);

export function ProgressOverview({ data, unit, onSelect }) {
  const { totals } = data;

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat
          label="Workouts"
          value={totals.workouts}
          sub={`${totals.last30Days} in last 30 days`}
        />
        <Stat label="Sets logged" value={totals.sets.toLocaleString()} />
        <Stat
          label="Total lifted"
          value={`${compactWeight(totals.lifetimeVolume, unit)} ${unitLabel(unit)}`}
          sub="weight × reps, all time"
        />
        <Stat
          label="Last workout"
          value={
            totals.lastWorkout ? convertUtcToDateFormat(totals.lastWorkout) : "—"
          }
          sub={`${totals.exercises} exercises tracked`}
        />
      </div>

      {data.recentPRs.length > 0 && (
        <Ranked
          title="Recent personal bests"
          caption="Your latest session on these matched or beat your heaviest ever."
          items={data.recentPRs}
          onSelect={onSelect}
          render={(e) => (
            <span className="font-mono text-success">
              {formatWeight(e.latestWeight, unit)}
            </span>
          )}
        />
      )}

      <Ranked
        title="Most logged"
        caption="Where your training time actually goes."
        items={data.mostLogged}
        onSelect={onSelect}
        empty="Log a few workouts to see this."
        render={(e) => (
          <span className="opacity-60">
            {e.sets} sets · {e.sessions} sessions
          </span>
        )}
      />

      <Ranked
        title="Biggest gains"
        caption="Change in top set from your first session to your most recent."
        items={data.mostProgressed}
        onSelect={onSelect}
        empty="Needs at least two sessions on an exercise."
        render={(e) => (
          <span className="font-mono text-success">
            +{compactWeight(e.change, unit)} {unitLabel(unit)}
            <span className="ml-1 opacity-60">+{e.percent}%</span>
          </span>
        )}
      />

      <Ranked
        title="Not moving"
        caption="Flat or down since you started them — candidates for a deload, a rep change, or a swap."
        items={data.leastProgressed}
        onSelect={onSelect}
        empty="Nothing stalled. Everything you've trained twice has gone up."
        render={(e) => (
          <span className="font-mono opacity-70">
            {e.change === 0
              ? `${formatWeight(e.latestWeight, unit)} flat`
              : `${compactWeight(e.change, unit)} ${unitLabel(unit)}`}
          </span>
        )}
      />
    </div>
  );
}
