import { useState } from "react";
import { useAuth } from "./auth/authContext";
import { useWorkout } from "./useWorkout";

import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import { ParentSize } from "@visx/responsive";

export const GraphWorkout = () => {
  const [graphWorkout, setGraphWorkout] = useState(false);
  const { user } = useAuth();

  const workouts = useWorkout("all");


  const getWeights =
    workouts &&
    workouts.filter((workout) => workout.id == graphWorkout)[0]?.weights;



  const chartData =
    getWeights &&
    getWeights
      .filter((entry) => entry.userId == user.id)
      .map((weight) => ({
        x: new Date(weight.date).toLocaleDateString(),
        y: weight.weight,
      }));

  const maxValue =
    chartData && Math.max(...chartData.map((xy) => Number(xy.y)));


  const accessors = {
    xAccessor: (d) => d.x,
    yAccessor: (d) => d.y,
  };

  const selectedWorkout = workouts?.find(
    (workout) => workout.id == graphWorkout
  );
  return (
    <>
      <h1 className="text-2xl">Workout Weight Progression</h1>
      {workouts && (
        <div className="dropdown dropdown-bottom ">
          <div tabIndex={0} role="button" className="flex items-center m-1">
            {selectedWorkout
              ? `${selectedWorkout?.name} ${selectedWorkout?.sets}x${selectedWorkout?.reps} `
              : "Select a Workout"}
            <span className="material-icons text-sm">
              &nbsp;expand_circle_down
            </span>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow overflow-y-scroll"
          >
            {workouts.map((workout, index) => (
              <li key={index}>
                <button onClick={() => setGraphWorkout(workout.id)}>
                  {`${workout.name} ${workout.sets}x${workout.reps}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!chartData?.length ? (
       !selectedWorkout ? "" :  <p>more data needed</p>
      ) : (
        <div style={{ width: "100%", height: 400 }}>
          <ParentSize>
            {({ width, height }) => (
              <XYChart
                width={width}
                height={height}
                xScale={{ type: "band" }}
                yScale={{ type: "linear", domain: [0, maxValue] }}
              >
                {/* Y-Axis */}
                <AnimatedAxis orientation="left" />
                <text
                  x={-height / 2}
                  y={20}
                  transform={`rotate(-90)`}
                  fontSize={14}
                  textAnchor="middle"
                >
                  Weight
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
                  y={height - 20}
                  fontSize={14}
                  textAnchor="middle"
                >
                  Date
                </text>

                {/* Grid */}
                <AnimatedGrid columns={true} numTicks={4} />

                {/* Line Series */}
                <AnimatedLineSeries
                  dataKey="Line 1"
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
                    <div>
                      <div
                        style={{
                          color: colorScale(tooltipData.nearestDatum.key),
                        }}
                      >
                        {tooltipData.nearestDatum.key}
                      </div>
                      {accessors.xAccessor(tooltipData.nearestDatum.datum)}
                      {", "}
                      {accessors.yAccessor(tooltipData.nearestDatum.datum)}
                    </div>
                  )}
                />
              </XYChart>
            )}
          </ParentSize>
        </div>
      )}
    </>
  );
};
