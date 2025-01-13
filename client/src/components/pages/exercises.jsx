import { Nav } from "../nav";
import { Workout } from "../workout";
import { useSearchParams } from "react-router-dom";
import { useWorkout } from "../useWorkout";

export function Exercises() {
  //   const [workouts, setWorkouts] = useState(null);

  const [searchParams] = useSearchParams();
  const workouts = useWorkout(searchParams);

  const showDivider = (index) => !(workouts && index == workouts.length - 1);

  // const workoutsLoaded = workouts.length

  return (
    <>
      <Nav workouts={workouts} />
      {workouts ? (
        <div className="pb-8">
          {workouts &&
            workouts.map((workout, index) => {
              return (
                <div key={index}>
                  <Workout workout={workout} />
                  {showDivider(index) && <div className="divider"></div>}
                </div>
              );
            })}
        </div>
      ) : (
        <div className="spinner-box">
          <span className="material-icons animate-spin spinner text-6xl">
            refresh
          </span>
        </div>
      )}
    </>
  );
}
