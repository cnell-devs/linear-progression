/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "./auth/authContext";

import { useMobile } from "./useMobile";
export const PastWeek = ({ workouts }) => {
  const { user } = useAuth();
  const mobile = useMobile();

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

    // Get today's date and start of the week (Sunday) in local timezone
    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay(),
      0,
      0,
      0
    );

    // Create an object to track entries for each day of the week
    const entriesByDay = daysOfWeek?.reduce((acc, day, index) => {
      const dayDate = new Date(startOfWeek); // Clone the startOfWeek date
      dayDate.setDate(startOfWeek.getDate() + index); // Increment to the correct day in local timezone

      // Check all weights for this day and user
      const hasEntry = workouts?.reduce((found, workout) => {
        const matches = workout.weights?.filter((weight) => {
          // Parse weight date - handle it as local time instead of forcing UTC
          const entryDate = new Date(weight.date);

          // Create a date object for comparison using local timezone
          const localEntryDate = new Date(
            entryDate.getFullYear(),
            entryDate.getMonth(),
            entryDate.getDate()
          );

          const localDayDate = new Date(
            dayDate.getFullYear(),
            dayDate.getMonth(),
            dayDate.getDate()
          );

          // Debug logging
          if (weight?.userId === user?.id) {
            console.log(
              `Weight date: ${weight.date}, Entry date: ${entryDate}, Local entry: ${localEntryDate}, Day date: ${localDayDate}`
            );
          }

          return (
            weight?.userId === user?.id && // Match user ID
            localEntryDate.getTime() === localDayDate.getTime()
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

      <ul className={`timeline ${mobile ? "timeline-vertical" : ""} mx-auto`}>
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
