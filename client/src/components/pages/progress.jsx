/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import { ParentSize } from "@visx/responsive";
import { Nav } from "../nav";
import { useUserWorkouts } from "../hooks/useUserWorkouts";
import { api } from "../../utils/api";
import {
  workoutName,
  formatWeight,
  roundWeight,
} from "../../utils/workout-display";
import { convertUtcToDateFormat } from "../../utils/date-formatter";

// Weight alone hides progress made by adding reps, so the same history can be
// read three ways.
const METRICS = [
  {
    key: "topWeight",
    label: "Top Set",
    unit: "lbs",
    describe: "Heaviest weight lifted in the session",
  },
  {
    key: "estimatedOneRepMax",
    label: "Est. 1RM",
    unit: "lbs",
    describe: "Epley estimate from your best set",
  },
  {
    key: "avgWeight",
    label: "Avg Weight",
    unit: "lbs",
    describe: "Mean load across the session's working sets",
  },
];

const StatTile = ({ label, value, sub }) => (
  <div className="rounded-lg border border-base-300 bg-base-100 p-3">
    <div className="text-[0.65rem] font-bold uppercase tracking-wide opacity-50">
      {label}
    </div>
    <div className="text-lg font-bold">{value}</div>
    {sub && <div className="text-xs opacity-60">{sub}</div>}
  </div>
);

export function Progress() {
  const { workouts, isLoading } = useUserWorkouts();
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState(null);
  const [metric, setMetric] = useState(METRICS[0]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Default to the first exercise so the page isn't an empty dropdown.
  useEffect(() => {
    if (!selectedId && workouts?.length) setSelectedId(workouts[0].id);
  }, [workouts, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setLoadingHistory(true);
    api(`/sessions/history/${selectedId}`)
      .then((data) => {
        if (!cancelled) setHistory(data);
      })
      .catch((err) => console.error("Failed to load history:", err))
      .finally(() => !cancelled && setLoadingHistory(false));
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const selected = workouts?.find((w) => w.id === selectedId);

  const chartData = useMemo(
    () =>
      (history || []).map((entry) => ({
        x: convertUtcToDateFormat(entry.date),
        y: entry[metric.key],
      })),
    [history, metric]
  );

  const latest = history?.length ? history[history.length - 1] : null;

  // Reps achieved at the heaviest weight of the most recent session.
  const topSetReps = latest
    ? latest.sets.reduce((best, s) => (s.weight > best.weight ? s : best))
        .reps
    : 0;

  const values = chartData.map((d) => Number(d.y));
  const domain = values.length
    ? [Math.min(...values) * 0.95, Math.max(...values) * 1.05]
    : [0, 1];

  const accessors = { xAccessor: (d) => d.x, yAccessor: (d) => d.y };

  return (
    <>
      <Nav />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4">
        <h1 className="mb-4 text-2xl font-bold">Progress</h1>

        <select
          className="select select-bordered mb-4 w-full text-base"
          value={selectedId || ""}
          onChange={(e) => setSelectedId(parseInt(e.target.value))}
          disabled={isLoading}
        >
          {isLoading && <option>Loading exercises...</option>}
          {(workouts || []).map((workout) => (
            <option key={workout.id} value={workout.id}>
              {workoutName(workout)}
            </option>
          ))}
        </select>

        {!isLoading && !workouts?.length && (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm opacity-60">
            No exercises yet. Log a workout to start tracking progress.
          </div>
        )}

        {selected && (
          <>
            <div role="tablist" className="tabs tabs-boxed mb-4">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  role="tab"
                  className={`tab ${metric.key === m.key ? "tab-active" : ""}`}
                  onClick={() => setMetric(m)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {loadingHistory && (
              <div className="py-12 text-center opacity-60">Loading...</div>
            )}

            {!loadingHistory && !history?.length && (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm opacity-60">
                No set data for {workoutName(selected)} yet. Log it in a workout
                and your progress will show up here.
              </div>
            )}

            {!loadingHistory && history?.length > 0 && (
              <>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {/* All three describe the most recent session; the date
                      on the first tile anchors the row. */}
                  <StatTile
                    label="Est. 1RM"
                    value={`${latest.estimatedOneRepMax}`}
                    sub={convertUtcToDateFormat(latest.date)}
                  />
                  <StatTile
                    label="Top Set"
                    value={`${roundWeight(latest.topWeight)}`}
                    sub={`${topSetReps} reps`}
                  />
                  <StatTile
                    label="Avg Weight"
                    value={`${roundWeight(latest.avgWeight)}`}
                    sub={`${latest.sets.length} sets`}
                  />
                </div>

                <p className="mb-2 text-xs opacity-60">{metric.describe}</p>

                {chartData.length < 2 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center text-sm opacity-60">
                    One session logged. Log another to see a trend.
                  </div>
                ) : (
                  <div className="w-full" style={{ height: 300 }}>
                    <ParentSize>
                      {({ width, height }) => (
                        <XYChart
                          width={width}
                          height={height}
                          xScale={{ type: "band" }}
                          // zero:false keeps the axis tight around the data —
                          // anchoring at 0 flattens strength changes to noise.
                          yScale={{ type: "linear", domain, zero: false }}
                          margin={{ top: 16, right: 16, bottom: 32, left: 48 }}
                        >
                          <AnimatedGrid columns={false} numTicks={4} />
                          <AnimatedAxis orientation="left" numTicks={5} />
                          <AnimatedAxis
                            orientation="bottom"
                            numTicks={Math.min(4, chartData.length)}
                          />
                          <AnimatedLineSeries
                            dataKey={metric.label}
                            data={chartData}
                            {...accessors}
                          />
                          <Tooltip
                            snapTooltipToDatumX
                            snapTooltipToDatumY
                            showVerticalCrosshair
                            showSeriesGlyphs
                            renderTooltip={({ tooltipData }) => (
                              <div className="rounded border bg-base-100 p-2 text-xs shadow-lg">
                                <div className="font-bold">
                                  {accessors.xAccessor(
                                    tooltipData.nearestDatum.datum
                                  )}
                                </div>
                                <div>
                                  {accessors.yAccessor(
                                    tooltipData.nearestDatum.datum
                                  )}{" "}
                                  {metric.unit}
                                </div>
                              </div>
                            )}
                          />
                        </XYChart>
                      )}
                    </ParentSize>
                  </div>
                )}

                <h2 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide opacity-50">
                  Session Log
                </h2>
                <div className="flex flex-col gap-2">
                  {[...history].reverse().map((entry) => (
                    <div
                      key={entry.sessionId}
                      className="rounded-lg border border-base-300 bg-base-100 p-3"
                    >
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-sm font-bold">
                          {convertUtcToDateFormat(entry.date)}
                        </span>
                        <span className="text-xs opacity-60">
                          {formatWeight(entry.avgWeight)} avg
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {entry.sets.map((set) => (
                          <span
                            key={set.setNumber}
                            className="badge badge-ghost badge-sm font-mono"
                          >
                            {set.weight} × {set.reps}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
