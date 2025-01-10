import { useAuth } from "../auth/authContext";
import { GraphWorkout } from "../graphWorkout";

import { Nav } from "../nav";
import { useState } from "react";

export const Profile = () => {
  const { user } = useAuth();


  return (
    <>
      <Nav />
      <GraphWorkout />
    </>
  );
};
