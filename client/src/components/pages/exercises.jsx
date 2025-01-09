
import { Nav } from "../nav";
import { Workout } from "../workout";
import { useSearchParams } from "react-router-dom";
import { useWorkout } from "../useWorkout";

export function Exercises() {
//   const [workouts, setWorkouts] = useState(null);

    const [searchParams] = useSearchParams();
const workouts = useWorkout(searchParams)
// setWorkouts()

//   useEffect(() => {
//     const fetchWorkouts = async () => {
//       const response = await fetch(
//         `api/workouts?split=${searchParams.get("split")}&alt=${searchParams.get(
//           "alt"
//         )}`
//       );

//       let data = await response.json();

//       if (!searchParams.get("alt")) {
//         const alternateIds = data
//           .filter((workout) => workout.alternateId !== null)
//           .map((workout) => workout.alternateId);

//         data = data.filter((workout) => !alternateIds.includes(workout.id));
//       } else {
//         data = data.filter((workout) => !workout.alternateId);
//       }

//       setWorkouts(data);
//     };

//     fetchWorkouts();
//   }, [searchParams]);

  const showDivider = (index) => !(workouts && index == workouts.length - 1);

  return (
    <>
      <Nav workouts={workouts} />
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
    </>
  );
}
