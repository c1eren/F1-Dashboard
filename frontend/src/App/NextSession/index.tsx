import { useEffect, useState } from "react";
import { sessions } from "./sessionList";
import { calculateCountdown } from "./calculateCountdown";
import './index.css'

function findNextSession() {
  const currentTime = Date.now();
  for (const event of Object.values(sessions)) {
    for (const sessionName in event.sessions) {
      const sessionDateStr = event.sessions[sessionName as keyof typeof event.sessions];
      const sessionDate = new Date(sessionDateStr).getTime();
      if (sessionDate >= currentTime) {
        return {
          eventSessions: event.sessions,
          eventName: event.eventName,
          sessionName: sessionName,
          time: sessionDate
        };
      }
    }
  }
}

function calculateLocal(sessionDate: number) {
  const localStr = new Date(sessionDate).toString();
  return localStr.replace('GMT', '\nGMT');
}

export function NextSession() {
  const [currentSession, setCurrentSession] = useState(findNextSession());

  useEffect(() => {
    if (currentSession) {
      const eventName   = document.getElementById("eventName");
      const sessionName = document.getElementById("sessionName");
      const localTime   = document.getElementById("localTimeNum");

      if (eventName)   { eventName.textContent   = currentSession.eventName + ":"; }
      if (sessionName) { sessionName.textContent = currentSession.sessionName; }
      if (localTime)   { localTime.textContent   = calculateLocal(currentSession.time); }
      calculateCountdown(currentSession);
    }
  }, [currentSession]);

  return (
    <div className="gridChildContent nextSessionContent overflow-hidden">
    
      <div className="primaryContent">

          <h1>Up next</h1>
          <div id="eventAndSession">
            <h2 id="eventName"></h2>
            <h3 id="sessionName"></h3>
          </div>
    
        <div id="countdownAndLocal" className="countdownAndLocal">
    
          <div id="countdownContainer" className="countdownContainer">
            <div className="timeSpecifiers">
              <div>Days</div>
              <div id="days">00</div>
            </div>
            <div className="timeSpecifiers">
              <div>Hours</div>
              <div id="hours">00</div>
            </div>
            <div className="timeSpecifiers">
              <div>Minutes</div>
              <div id="minutes">00</div>
            </div>
            <div className="timeSpecifiers">
              <div>Seconds</div>
              <div id="seconds">00</div>
            </div>  
          </div>
    
          <div id="localTimeContainer" className="localTimeContainer">
            <div>Local</div>
            <div id="localTimeNum" className="whitespace-pre-line"></div>
          </div>
        </div>
      </div>
    
      <div className="secondaryContent">
          <div id="otherCountdowns" className="otherCountdowns"></div>
      </div>
    
    </div>
  );
}


// import { useEffect, useState } from "react";
// import { sessions } from "./sessionList";
// import { calculateCountdown } from "./calculateCountdown";

// function findNextSession() {
//   const currentTime = Date.now();
//   for (const event of Object.values(sessions)) {
//     for (const sessionName in event.sessions) {
//       const sessionDateStr = event.sessions[sessionName as keyof typeof event.sessions];
//       const sessionDate = new Date(sessionDateStr).getTime();
//       if (sessionDate >= currentTime) {
//         return {
//           eventSessions: event.sessions,
//           eventName: event.eventName,
//           sessionName: sessionName,
//           time: sessionDate
//         };
//       }
//     }
//   }
// }

// function calculateLocal(sessionDate: number) {
//   const localStr = new Date(sessionDate).toString();
//   return localStr.replace('GMT', '\nGMT');
// }

// export function NextSession() {
//   const [currentSession, setCurrentSession] = useState(findNextSession());

//   useEffect(() => {
//     if (currentSession) {
//       const eventName   = document.getElementById("eventName");
//       const sessionName = document.getElementById("sessionName");
//       const localTime   = document.getElementById("localTimeNum");

//       if (eventName)   { eventName.textContent   = currentSession.eventName + ":"; }
//       if (sessionName) { sessionName.textContent = currentSession.sessionName; }
//       if (localTime)   { localTime.textContent   = calculateLocal(currentSession.time); }
//       calculateCountdown(currentSession);
//     }
//   }, [currentSession]);

//   return (
//     <div className="gridChildContent nextSessionContent h-full w-full overflow-hidden">
//       <div id="countdownBannerContainer" className="countdownBannerContainer w-full h-full flex flex-col">

//         <div id="eventAndSessionCTA" className="flex flex-col justify-center">
//           <div>Up next</div>
//           <div id="eventAndSession" className="flex flex-wrap gap-2">
//             <div id="eventName"></div>
//             <div id="sessionName"></div>
//           </div>
//         </div>

//         <div id="timingContainers" className="w-full h-full flex flex-col justify-evenly">

//           <div id="countdownAndLocal" className="flex flex-wrap gap-4 justify-center">

//             <div id="countdownContainer" className="gap-4 flex flex-row flex-wrap">
//               <div className="flex flex-col justify-center">
//                 <div>Days</div>
//                 <div id="days">00</div>
//               </div>
//               <div className="flex flex-col justify-center">
//                 <div>Hours</div>
//                 <div id="hours">00</div>
//               </div>
//               <div className="flex flex-col justify-center">
//                 <div>Minutes</div>
//                 <div id="minutes">00</div>
//               </div>
//               <div className="flex flex-col justify-center">
//                 <div>Seconds</div>
//                 <div id="seconds">00</div>
//               </div>  
//             </div>

//             <div id="localTimeContainer" className="flex flex-col">
//               <div>Local</div>
//               <div id="localTimeNum" className="whitespace-pre-line"></div>
//             </div>

//           </div>

//           <div></div> {/* removed border styling */}

//           <div>
//             <div id="otherCountdowns" className="otherCountdownsflex-1 overflow-auto flex"></div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }


// // import { useEffect, useState } from "react";
// // import { sessions } from "./sessionList";
// // import { calculateCountdown } from "./calculateCountdown";
// // // import "./index.css"; 

// // function findNextSession() {
// //       const currentTime = Date.now();
// //       for (const event of Object.values(sessions)) {
// //         for (const sessionName in event.sessions) {
// //             const sessionDateStr = event.sessions[sessionName as keyof typeof event.sessions];
// //             const sessionDate = new Date(sessionDateStr).getTime();
            
// //           if (sessionDate >= currentTime) {
            
// //             return ({eventSessions: event.sessions, eventName: event.eventName, sessionName: sessionName, time: sessionDate});
// //           }
// //         }
// //     }
// // }

// // function calculateLocal(sessionDate: number) {
// //     const localStr = new Date(sessionDate).toString(); 
// //     return localStr.replace('GMT', '\nGMT');
// // }

// // export function NextSession() {
// //     const [currentSession, setCurrentSession] = useState(findNextSession());

// //         useEffect(() => {
// //             if (currentSession) {
// //                 const eventName   = document.getElementById("eventName");
// //                 const sessionName = document.getElementById("sessionName");
// //                 const localTime   = document.getElementById("localTimeNum");

// //                 if (eventName)   { eventName.textContent   = currentSession.eventName + ":"; }
// //                 if (sessionName) { sessionName.textContent = currentSession.sessionName; }
// //                 if (localTime)   { localTime.textContent   = calculateLocal(currentSession.time); }
// //                 calculateCountdown(currentSession);
// //             }
// //         }, [currentSession]);

// //     return (
// //     <div className="gridChildContent nextSessionContent h-full w-full overflow-hidden">
// //         <div id="countdownBannerContainer" className="w-full h-full flex flex-col">

// //             <div id="eventAndSessionCTA" className="flex flex-col justify-center">

// //                 <div>Up next</div>
// //                 <div id="eventAndSession" className="flex flex-wrap gap-2">
// //                     <div id="eventName" className="text-2xl text-nowrap"></div>
// //                     <div id="sessionName" className="text-2xl font-bold text-nowrap"></div>
// //                 </div>
// //             </div>

// //             <div id="timingContainers" className="w-full h-full flex flex-col justify-evenly">

// //                 <div id="countdownAndLocal" className="flex flex-wrap gap-4 justify-center">
// //                     <div id="countdownContainer" className="gap-4 flex flex-row flex-wrap text-2xl font-bold">
// //                         <div className="flex flex-col justify-center">
// //                             <div>Days</div>
// //                             <div id="days" className="font-normal">00</div>
// //                         </div>
// //                         <div className="flex flex-col justify-center">
// //                             <div>Hours</div>
// //                             <div id="hours" className="font-normal">00</div>
// //                         </div>
// //                         <div className="flex flex-col justify-center">
// //                             <div>Minutes</div>
// //                             <div id="minutes" className="font-normal">00</div>
// //                         </div>
// //                         <div className="flex flex-col justify-center">
// //                             <div>Seconds</div>
// //                             <div id="seconds" className="font-normal">00</div>
// //                         </div>  
// //                     </div>


// //                     <div id="localTimeContainer" className="flex flex-col">
// //                         <div>Local</div>
// //                         <div id="localTimeNum" className="whitespace-pre-line"></div>
// //                     </div>
// //                 </div>

// //                 <div className="border"></div>

// //                 <div>
// //                     <div id="otherCountdowns" className="flex-1 overflow-auto flex gap-10"></div>
// //                 </div>

// //             </div>
            
// //         </div>
// //     </div>
// // );

// // }