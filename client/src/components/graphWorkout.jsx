/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useAuth } from "./auth/authContext";
import { useTemplates } from "../hooks/useTemplates";
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import { ParentSize } from "@visx/responsive";
import { EntryLog } from "./entryLog";
import { AddEntryModal } from "./addEntryModal";
import { convertUtcToDateFormat } from "../utils/date-formatter";

export const GraphWorkout = ({ workouts, fetchData }) => {
  const [graphWorkout, setGraphWorkout] = useState(false);
  const [templateFilter, setTemplateFilter] = useState("all"); // "all", "none", or template ID
  const { user } = useAuth();
  const { userTemplates } = useTemplates();

  // Reset template filter when workout changes
  useEffect(() => {
    setTemplateFilter("all");
  }, [graphWorkout]);

  const getWeights =
    workouts &&
    workouts.filter((workout) => workout.id == graphWorkout)[0]?.weights;

  // Filter weights based on template selection
  const getFilteredWeights = () => {
    if (!getWeights) return null;

    let filteredWeights = getWeights.filter((entry) => entry.userId == user.id);

    if (templateFilter !== "all") {
      if (templateFilter === "none") {
        // Show only entries without a template
        filteredWeights = filteredWeights.filter(
          (entry) => entry.templateId === null || entry.templateId === undefined
        );
      } else {
        // Show only entries for specific template
        filteredWeights = filteredWeights.filter(
          (entry) => entry.templateId == templateFilter
        );
      }
    }
    // If "all", show all entries (no additional filtering)

    return filteredWeights;
  };

  const chartData =
    getFilteredWeights() &&
    getFilteredWeights()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((weight) => ({
        x: convertUtcToDateFormat(new Date(weight.date).toISOString()),
        y: weight.weight,
      }));

  const maxValue =
    chartData && Math.max(...chartData.map((xy) => Number(xy.y)));
  const minValue =
    chartData && Math.min(...chartData.map((xy) => Number(xy.y)));

  const accessors = {
    xAccessor: (d) => d.x,
    yAccessor: (d) => d.y,
  };

  const selectedWorkout = workouts?.find(
    (workout) => workout.id == graphWorkout
  );
  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-xl sm:text-2xl mb-4">Workout Weight Progression</h1>
      {workouts && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="dropdown dropdown-bottom w-full sm:w-auto">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center m-1 btn btn-outline w-full sm:w-auto justify-between"
              >
                <span className="truncate">
                  {selectedWorkout ? selectedWorkout?.name : "Select a Workout"}
                </span>
                <span className="material-icons text-sm ml-2">
                  expand_circle_down
                </span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box w-full sm:w-52 p-2 shadow overflow-y-scroll z-10 max-h-60"
              >
                {workouts.map((workout, index) => (
                  <li key={index}>
                    <button onClick={() => setGraphWorkout(workout.id)}>
                      {workout.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="flex items-center justify-center btn btn-primary w-full sm:w-auto"
              onClick={() =>
                document.getElementById("add_entry_modal").showModal()
              }
            >
              <span className="material-icons text-sm mr-2">add_circle</span>
              Add An Entry
            </button>
          </div>

          {/* Template Filter */}
          {selectedWorkout && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium">Filter by Template:</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="dropdown dropdown-bottom flex-1 sm:flex-none">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center justify-between btn btn-sm btn-outline w-full sm:w-auto"
                  >
                    <span className="truncate">
                      {templateFilter === "all"
                        ? "All Templates"
                        : templateFilter === "none"
                        ? "No Template"
                        : userTemplates.find((t) => t.id == templateFilter)
                            ?.name || "Unknown Template"}
                    </span>
                    <span className="material-icons text-sm ml-1">
                      expand_circle_down
                    </span>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box w-full sm:w-52 p-2 shadow z-10 max-h-60 overflow-y-scroll"
                  >
                    <li>
                      <button onClick={() => setTemplateFilter("all")}>
                        All Templates
                      </button>
                    </li>
                    {userTemplates.map((template) => (
                      <li key={template.id}>
                        <button onClick={() => setTemplateFilter(template.id)}>
                          {template.name}
                        </button>
                      </li>
                    ))}
                    {/* Show "No Template" option if there are entries without templateId */}
                    {getWeights &&
                      getWeights.some(
                        (entry) =>
                          entry.userId == user.id &&
                          (entry.templateId === null ||
                            entry.templateId === undefined)
                      ) && (
                        <li>
                          <button onClick={() => setTemplateFilter("none")}>
                            No Template
                          </button>
                        </li>
                      )}
                  </ul>
                </div>
                {templateFilter !== "all" && (
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => setTemplateFilter("all")}
                    title="Clear filter"
                  >
                    <span className="material-icons text-sm">clear</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!chartData?.length ? (
        !selectedWorkout ? (
          ""
        ) : (
          <p className="text-center text-gray-500 py-8">
            More data needed to display chart
          </p>
        )
      ) : (
        <div
          className="w-full"
          style={{ height: window.innerWidth < 640 ? 300 : 400 }}
        >
          <ParentSize>
            {({ width, height }) => (
              <XYChart
                width={width}
                height={height}
                xScale={{ type: "band" }}
                yScale={{ type: "linear", domain: [minValue, maxValue] }}
              >
                {/* Y-Axis */}
                <AnimatedAxis orientation="left" />
                <text
                  x={-height / 2}
                  y={15}
                  transform={`rotate(-90)`}
                  fontSize={window.innerWidth < 640 ? 12 : 14}
                  textAnchor="middle"
                >
                  Weight &#40;lbs&#41;
                </text>

                {/* X-Axis */}
                <AnimatedAxis
                  orientation="bottom"
                  tickLabelProps={() => ({
                    display: "none",
                  })}
                />
                <text
                  x={width / 2}
                  y={height - 10}
                  fontSize={window.innerWidth < 640 ? 12 : 14}
                  textAnchor="middle"
                >
                  Date
                </text>

                {/* Grid */}
                <AnimatedGrid
                  columns={true}
                  numTicks={window.innerWidth < 640 ? 3 : 4}
                />

                {/* Line Series */}
                <AnimatedLineSeries
                  dataKey=""
                  data={chartData}
                  {...accessors}
                />

                {/* Tooltip */}
                <Tooltip
                  snapTooltipToDatumX
                  snapTooltipToDatumY
                  showVerticalCrosshair
                  showSeriesGlyphs
                  renderTooltip={({ tooltipData, colorScale }) => (
                    <div className="bg-white p-2 rounded shadow-lg border text-xs sm:text-sm">
                      <div
                        style={{
                          color: colorScale(tooltipData.nearestDatum.key),
                        }}
                      >
                        {tooltipData.nearestDatum.key}
                      </div>
                      {accessors.xAccessor(tooltipData.nearestDatum.datum)}
                      &nbsp;
                      {accessors.yAccessor(tooltipData.nearestDatum.datum)}
                    </div>
                  )}
                />
              </XYChart>
            )}
          </ParentSize>
        </div>
      )}
      {workouts && (
        <EntryLog
          workouts={workouts}
          selected={selectedWorkout}
          fetchData={fetchData}
          templateFilter={templateFilter}
          userTemplates={userTemplates}
        />
      )}
      <AddEntryModal selected={selectedWorkout} fetchData={fetchData} />
    </div>
  );
};
