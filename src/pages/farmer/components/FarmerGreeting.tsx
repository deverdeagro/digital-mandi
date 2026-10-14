import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import FarmerProfilePanel from "./FarmerProfilePanel";

export default function FarmerGreeting() {
  const { user } = useAuth();
  const [today] = useState(() => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).formatToParts(new Date());
    const datePart = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
    return `${datePart("weekday")}, ${datePart("day")} ${datePart("month")}`.toUpperCase();
  });

  return (
    <div className="greeting-row farmer-greeting-row">
      <div>
        <p className="dashboard-date">{today}</p>
        <h1>Hello, {user?.name.split(" ")[0] ?? "Farmer"}</h1>
      </div>
      <FarmerProfilePanel />
    </div>
  );
}
