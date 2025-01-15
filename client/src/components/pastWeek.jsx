/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "./auth/authContext";

import { useMobile } from "./useMobile";
export const PastWeek = ({workouts}) => {
    const { user } = useAuth();
    const mobile = useMobile()

  const [week, setWeek] = useState(false);



useEffect(() => {
  // Define the days of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Helper function to get the start of the day in EST
  const getStartOfDayEST = (date) => {
    const offset = 300; // EST offset in minutes (UTC-5:00)
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(utc - offset * 60000);
  };

  // Helper function to get the start of the week (Sunday) in EST
  const getStartOfWeekEST = (date) => {
    const startOfDay = getStartOfDayEST(date);
    const dayOffset = startOfDay.getDay(); // Sunday is 0
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - dayOffset);
    return startOfWeek;
  };

  // Get today's date and start of the week in EST
  const today = new Date();
  const startOfWeekEST = getStartOfWeekEST(today);

  // Create an object to track entries for each day of the week
  const entriesByDay = daysOfWeek.reduce((acc, day, index) => {
    const dayDate = new Date(startOfWeekEST); // Clone the startOfWeek date
    dayDate.setDate(startOfWeekEST.getDate() + index); // Increment to the correct day in EST

    // Check all weights for this day and user
    const hasEntry = workouts?.reduce((found, workout) => {
      const matches = workout.weights?.filter((weight) => {
        // Parse weight date and convert to EST
        const entryDate = getStartOfDayEST(new Date(weight.date));

        return (
          weight?.userId === user?.id && // Match user ID
          entryDate.getFullYear() === dayDate.getFullYear() &&
          entryDate.getMonth() === dayDate.getMonth() &&
          entryDate.getDate() === dayDate.getDate()
        );
      });

      // If there are matches for this day, set `found` to true
      return found || matches?.length > 0;
    }, false);

    acc[day] = hasEntry; // Set the result for this day
    return acc;
  }, {});

  setWeek(entriesByDay);
}, [workouts, user?.id]);


  return (
    <>
      <h1 className="text-2xl">This Week</h1>


      <ul className={`timeline ${ mobile ? "timeline-vertical" : ""} mx-auto`}>
        <li>
          <div className="timeline-start timeline-box">Sun</div>
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={`${week?.Sunday ? "green" : "grey"}`}
              className="text-primary h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
        </li>
        <li>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={`${week?.Monday ? "green" : "grey"}`}
              className="text-primary h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end timeline-box">Mon</div>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
        </li>
        <li>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
          <div className="timeline-start timeline-box">Tues</div>
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={`${week?.Tuesday ? "green" : "grey"}`}
              className="text-primary h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
        </li>
        <li>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={`${week?.Wednesday ? "green" : "grey"}`}
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end timeline-box">Wed</div>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
        </li>
        <li>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
          <div className="timeline-start timeline-box">Thurs</div>
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={`${week?.Thursday ? "green" : "grey"}`}
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
        </li>
        <li>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={`${week?.Friday ? "green" : "grey"}`}
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end timeline-box">Fri</div>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
        </li>
        <li>
              <hr className="bg-gray-500 h-0.5 sm:h-1 md:h-1.5 lg:h-2" />
          <div className="timeline-start timeline-box">Sat</div>
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={`${week?.Saturday ? "green" : "grey"}`}
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </li>
      </ul>
    </>
  );
};
