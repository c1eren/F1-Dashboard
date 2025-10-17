import { useEffect, useState } from "react";
import { sessions } from "./sessionList";

export function NextSession() {
  const [timeTill, setTimeTill] = useState<{ label: string; value: number }[] | null>(null);

  useEffect(() => {
    const findNextSession = () => {
      const currentTime = Date.now(); // recalc every tick
      for (const event of Object.values(sessions)) {
        for (const sessionDateStr of Object.values(event.sessions)) {
          const sessionDate = new Date(sessionDateStr).getTime();
          if (sessionDate >= currentTime) {
            const diff = sessionDate - currentTime;
            const diffSeconds = Math.trunc((diff / 1000) % 60);
            const diffMinutes = Math.trunc((diff / 1000 / 60) % 60);
            const diffHours = Math.trunc((diff / 1000 / 60 / 60) % 24);
            const diffDays = Math.trunc(diff / 1000 / 60 / 60 / 24);

            return [
              { label: "Days", value: diffDays },
              { label: "Hours", value: diffHours },
              { label: "Minutes", value: diffMinutes },
              { label: "Seconds", value: diffSeconds },
            ];
          }
        }
      }
      return null; // No upcoming session
    };

    // Initial calculation
    setTimeTill(findNextSession());

    // Update every second
    const interval = setInterval(() => {
      setTimeTill(findNextSession());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (!timeTill) return <div>No upcoming sessions</div>;

  return (
    <div className="border justify-center gap-4 p-4 flex flex-row text-2xl font-bold ">
      {timeTill.map((timeUnit) => (
        <div className="truncate" key={timeUnit.label}>
          <div className="truncate">{timeUnit.label}</div>
          <div className="truncate">{timeUnit.value}</div>
        </div>
      ))}
    </div>
  );
}
