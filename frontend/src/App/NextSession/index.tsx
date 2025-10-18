import { useEffect, useState } from "react";
import { sessions } from "./sessionList";
import { calculateCountdown } from "./calculateCountdown";

function findNextSession() {
      const currentTime = Date.now();
      for (const event of Object.values(sessions)) {
        for (const sessionName in event.sessions) {
            const sessionDateStr = event.sessions[sessionName as keyof typeof event.sessions];
            const sessionDate = new Date(sessionDateStr).getTime();
            
          if (sessionDate >= currentTime) {
            
            return ({eventSessions: event.sessions, eventName: event.eventName, sessionName: sessionName, time: sessionDate});
          }
        }
    }
}

export function NextSession() {
    const [currentSession, setCurrentSession] = useState(findNextSession());

        useEffect(() => {
            if (currentSession) {
                const eventName   = document.getElementById("eventName");
                const sessionName = document.getElementById("sessionName");
                if (eventName)   { eventName.textContent   = currentSession.eventName + ":"; }
                if (sessionName) { sessionName.textContent = currentSession.sessionName; }
                calculateCountdown(currentSession);
            }
        }, [currentSession]);

    return (
        <>
            <div id="countdownBannerContainer" className="border flex flex-row">
                <div id="eventAndSessionCTA" className="p-4 flex flex-col justify-center">
                    <div className="">Up next</div>
                    <div id="eventAndSession" className="flex gap-2">
                        <div id="eventName" className="text-2xl"></div>
                        <div id="sessionName" className="text-2xl font-bold"></div>
                    </div>
                    <div id="otherCountdowns" className="border">
                        
                    </div>
                </div>
                
                <div id="countdownContainer" className="border justify-center gap-4 p-4 flex flex-row text-2xl font-bold truncate">
                    <div className="flex flex-col justify-center">
                        <div>Days</div>
                        <div id="days" className="truncate font-normal">00</div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div>Hours</div>
                        <div id="hours" className="truncate font-normal">00</div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div>Minutes</div>
                        <div id="minutes" className="truncate font-normal">00</div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div>Seconds</div>
                        <div id="seconds" className="truncate font-normal">00</div>
                    </div>  
                </div>
            </div>
        </>
    );
}
