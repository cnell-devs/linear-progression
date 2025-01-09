import { Link } from "react-router-dom";
import { Nav } from "../nav";
import { useState } from "react";

export function Home() {
  const [split, setSplit] = useState(null);

  return (
    <>
      <Nav split={split} setSplit={setSplit} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {!split && (
          <ul className="menu bg-base-200 rounded-box w-56">
            <li className="menu-title">Today&apos;s Split</li>
            <button onClick={() => setSplit("push")} className="btn">
              Push
            </button>
            <button onClick={() => setSplit("pull")} className="btn">
              Pull
            </button>
            <button className="btn">
              <Link to="/exercises?split=legs">Legs</Link>
            </button>
          </ul>
        )}
        {split && (
          <ul className="menu bg-base-200 rounded-box w-56">
            <li className="menu-title">Primary or Alternate Day?</li>
            <button className="btn">
              <Link to={`/exercises?split=${split}`}>Primary</Link>
            </button>
            <button className="btn">
              <Link to={`/exercises?split=${split}&alt=true`}>Alt</Link>
            </button>
          </ul>
        )}
      </div>
    </>
  );
}
