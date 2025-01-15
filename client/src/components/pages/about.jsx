import { Nav } from "../nav";
import { useState } from "react";
import { DeleteModal } from "../deleteModal";

export function About() {
  const [split, setSplit] = useState(null);

  return (
    <>
      <Nav split={split} setSplit={setSplit} />
      <div className="overflow-scroll">
        <div className=" text-center w-full mb-4">
          Crafted from this&nbsp;
          <a
            className="text-red-600"
            href="https://www.reddit.com/r/Fitness/comments/37ylk5/a_linear_progression_based_ppl_program_for/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
            target="_blank"
          >
            <u>Reddit Post</u>
          </a>
        </div>
        <div>
          <div>
            <span className="text-red-600">Key Features</span> of the Program
          </div>
          <ul className="">
            <div className="text-red-600">Structure</div>
            <li>
              Three distinct workout days (Push, Pull, Legs), typically run 6
              days a week (PPLPPLR, with one rest day).
            </li>
          </ul>
          <ul className="mt-5">
            <span className="text-red-600">Linear Progression</span>
            <li>
              Incremental weight increases on key lifts each week to promote
              strength development.
            </li>
          </ul>
          <ul className="mt-5">
            <span className="text-red-600">Compound Focus</span>
            <li>
              Heavy emphasis on big lifts like bench press, squats, deadlifts,
              overhead press, and rows.
            </li>
          </ul>
          <ul className="mt-5">
            <span className="text-red-600">Accessory Work</span>
            <li>
              Includes isolation movements for arms, shoulders, and abs to
              complement the compounds and support hypertrophy.
            </li>
          </ul>
          <ul className="mt-5">
            <span className="text-red-600">Volume and Recovery</span>
            <li>
              Moderate volume to prevent burnout while still providing enough
              stimulus to grow.
            </li>
          </ul>
          <ul className="mt-5 list-disc list-inside">
            <div className="text-red-600">Progression Tips</div>
            <li>Add 5-10 lbs to compound lifts each week if possible.</li>
            <li>
              Adjust isolation lift weights as needed for form and progress.
            </li>
            <li>
              Take deload weeks if performance stalls or recovery becomes an
              issue.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">If you find this useful, feel free to donate on cashapp!</div>
      <div className="text-green-500 w-full text-center">$naiharris</div>
      <button
        className=" text-red-600 mt-10 mb-5 text-center w-full"
        onClick={() => document.getElementById("my_modal").showModal()}
      >
        delete my account
      </button>
      <DeleteModal />
    </>
  );
}
