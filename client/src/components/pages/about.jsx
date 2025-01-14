
import { Nav } from "../nav";
import { useState } from "react";
import {DeleteModal} from "../deleteModal";

export function About() {
  const [split, setSplit] = useState(null);

  return (
    <>
      <Nav split={split} setSplit={setSplit} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        Crafted from this&nbsp;
        <a
          className="text-red-600"
          href="https://www.reddit.com/r/Fitness/comments/37ylk5/a_linear_progression_based_ppl_program_for/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
          target="_blank"
        >
          Reddit Post
        </a>
      </div>
      <button
        className="absolute bottom-0 left-1/2 text-red-600 transform -translate-x-1/2 -translate-y-1/2"
        onClick={() => document.getElementById("my_modal").showModal()}
      >
        delete my account
      </button>
      <DeleteModal />
    </>
  );
}
