let countdownTimeout: NodeJS.Timeout; // Store timeout id for cleanup
let subCountdownTimeout: NodeJS.Timeout; // Store timeout id for subcleanup

interface event {
    eventName: string;
    circuitId: number;
    timezone: string;
    f1RaceID: string;
        sessions: {
        'Practice 1': string;
        'Practice 2': string;
        'Practice 3': string;
        'Qualifying': string;
        'Race': string;
        } | {
        'Practice 1': string;
        'Sprint Qualifying': string;
        'Sprint Race': string;
        'Qualifying': string;
        'Race': string;
    }
}

interface CountdownSession {
  eventSessions: event['sessions']
  eventName: string;
  sessionName: string;
  time: number;
}

export function calculateCountdown(sessions: CountdownSession) {
    const update = () => {

        const days    = document.getElementById('days');
        const hours   = document.getElementById('hours');
        const minutes = document.getElementById('minutes');
        const seconds = document.getElementById('seconds');
        const currentTime = Date.now(); // recalc every tick
        const diff = sessions.time - currentTime;

        if (diff >= 0) {
            const diffSeconds = Math.trunc((diff / 1000) % 60);
            const diffMinutes = Math.trunc((diff / 1000 / 60) % 60);
            const diffHours   = Math.trunc((diff / 1000 / 60 / 60) % 24);
            const diffDays    = Math.trunc(diff / 1000 / 60 / 60 / 24);
        
            if(days)    {days.textContent    = diffDays.toString();}
            if(hours)   {hours.textContent   = diffHours.toString();}
            if(minutes) {minutes.textContent = diffMinutes.toString();}
            if(seconds) {seconds.textContent = diffSeconds.toString();}
        }
        else {
            // When countdown finishes
            if (days)    {days.textContent    = '00';}
            if (hours)   {hours.textContent   = '00';}
            if (minutes) {minutes.textContent = '00';}
            if (seconds) {seconds.textContent = '00';}
        }

        calculateOtherCountdowns(sessions.eventSessions, currentTime);

        // Clear existing timeout by ID and set a new one
        clearTimeout(countdownTimeout);
        countdownTimeout = setTimeout(() => calculateCountdown(sessions), 1000);
    }
    update();
}

function calculateOtherCountdowns(eventSessions: CountdownSession['eventSessions'], currentTime: number) {
    
    let skipCurrent: boolean = true;
    const currentSubTime = Date.now();
    // const backupDate = new Date("2025-10-28");

    for (const event in eventSessions) {
            const sessionDateStr = eventSessions[event as keyof typeof eventSessions];
            const sessionDate = new Date(sessionDateStr).getTime();
            const diff = sessionDate - currentTime;
            
        if (diff >= 0) {
             if (skipCurrent) { skipCurrent = false; continue}
            const diffSeconds = Math.trunc((diff / 1000) % 60);
            const diffMinutes = Math.trunc((diff / 1000 / 60) % 60);
            const diffHours   = Math.trunc((diff / 1000 / 60 / 60) % 24);
            const diffDays    = Math.trunc(diff / 1000 / 60 / 60 / 24);
            const otherCounts = document.getElementById('otherCountdowns');

            if (!document.getElementById(event)) {
                const cContainer = document.createElement('div');
                cContainer.id = event;
                cContainer.className = "pl-4";

                    const sessionTitle = document.createElement('div');
                    sessionTitle.className = 'font-bold';
                    sessionTitle.textContent = event;

                    const timerContainer = document.createElement('div');
                    timerContainer.className = 'justify-start gap-4 flex flex-row truncate';

                        const daysContainer    = document.createElement('div');
                        daysContainer.className = 'flex flex-col justify-center';
                        const hoursContainer   = document.createElement('div');
                        hoursContainer.className = 'flex flex-col justify-center';  
                        const minutesContainer = document.createElement('div');
                        minutesContainer.className = 'flex flex-col justify-center';
                        const secondsContainer = document.createElement('div');
                        secondsContainer.className = 'flex flex-col justify-center';

                            const daysText = document.createElement('div');
                            daysText.textContent = "Days";
                            const hoursText = document.createElement('div');
                            hoursText.textContent = "Hours";
                            const minutesText = document.createElement('div');
                            minutesText.textContent = "Minutes";
                            const secondsText = document.createElement('div');
                            secondsText.textContent = "Seconds";

                            const days    = document.createElement('div');
                            days.className = 'truncate font-normal';
                            const hours   = document.createElement('div');
                            hours.className = 'truncate font-normal';                  
                            const minutes = document.createElement('div');
                            minutes.className = 'truncate font-normal';
                            const seconds = document.createElement('div');
                            seconds.className = 'truncate font-normal';

                            if(days)    {days.textContent    = diffDays.toString();   }
                            if(hours)   {hours.textContent   = diffHours.toString();  }
                            if(minutes) {minutes.textContent = diffMinutes.toString();}
                            if(seconds) {seconds.textContent = diffSeconds.toString();}

                        daysContainer.append(daysText, days);
                        hoursContainer.append(hoursText, hours);
                        minutesContainer.append(minutesText, minutes);
                        secondsContainer.append(secondsText, seconds);

                 // Append in order
                timerContainer.append(daysContainer, hoursContainer, minutesContainer, secondsContainer);
                cContainer.append(sessionTitle, timerContainer);

                if (cContainer) { otherCounts?.appendChild(cContainer); }
            }
            else {
                const container = document.getElementById(event);
                if (container) {
                    const timerContainer = container.childNodes[1];
                    if (timerContainer) {
                        const [daysContainer, hoursContainer, minutesContainer, secondsContainer] = Array.from(timerContainer.childNodes) as HTMLElement[];
                        (daysContainer.children[1] as HTMLElement).textContent    = diffDays.toString();
                        (hoursContainer.children[1] as HTMLElement).textContent   = diffHours.toString();
                        (minutesContainer.children[1] as HTMLElement).textContent = diffMinutes.toString();
                        (secondsContainer.children[1] as HTMLElement).textContent = diffSeconds.toString();
                    }
                }
            }
        }
    }

    // Clear existing timeout by ID and set a new one
    clearTimeout(subCountdownTimeout);
    subCountdownTimeout = setTimeout(() => calculateOtherCountdowns(eventSessions, currentSubTime), 1000);
}