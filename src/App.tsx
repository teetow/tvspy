import React, { useState } from "react";
import Picker from "./ui/Picker";
import Schedule from "./ui/Schedule";

import "./App.scss";

function App() {
  const [shows, setShows] = useState<string[]>([
    "star%20trek%20discovery",
    "the%20book%20of%20boba%20fett",
    "the%20expanse",
    "the%20witcher",
    "hawkeye",
    "battlebots",
  ]);
  return (
    <div className="ts-app ts-theme">
      <header className="ts-app__header">
        <h1>TVSpy</h1>
      </header>
      <Picker shows={shows} onSetShows={setShows} />
      <Schedule shows={shows} />
    </div>
  );
}

export default App;
