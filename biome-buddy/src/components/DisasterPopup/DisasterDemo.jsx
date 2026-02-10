import { useState } from "react";
import DisasterPopup from "./DisasterPopup";
import { disasters } from "../../data/disasters";

export default function DisasterDemo() {
  const [active, setActive] = useState(null);

  return (
    <>
      {/* remove after Sprint 1 */}
      <div style={{ padding: "1rem" }}>
        {Object.keys(disasters).map(key => (
          <button
            key={key}
            style={{ marginRight: "0.5rem" }}
            onClick={() => setActive(disasters[key])}
          >
            Trigger {disasters[key].title}
          </button>
        ))}
      </div>

      <DisasterPopup
        disaster={active}
        onClose={() => setActive(null)}
      />
    </>
  );
}
