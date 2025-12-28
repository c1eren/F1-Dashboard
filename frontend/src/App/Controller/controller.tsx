import { useState } from 'react';
import { DriverInfo } from '../DriverInfo';
import { DriverStandings } from '../DriverStandings';
import { NextSession } from '../NextSession';

import './TableDriverInfoController.css';


interface DriverInfoProps {
  selectedDriver: number | null;
  driverName: string;
}

export function TableDriverInfoController() {

  // Store a list of driver info objects
  const [driverInfoList, setDriverInfoList] = useState<DriverInfoProps[]>([]);

// Handler for clicking a driver in the standings
  const handleDriverClick = (driverId: number, driverName: string) => {

    // Avoid duplicates if needed, do I want to enable duplicates? probably not?? leave it for now
    setDriverInfoList(prev => {
      // prev here is the previous state of the list
      // .some() being: if we find driverId in list already, just return the list as it is now
      // Otherwise return "...prev", everything in the previous list, {selectedDriver: etc.} plus this new addition on the end
      if (prev.some(d => d.selectedDriver === driverId)) return prev;
      return [...prev, { selectedDriver: driverId, driverName }];
    });
  };

  const handleCloseDriver = (driverId: number) => {
    // Need to get this to remove item from DOM to trigger button remove
    // filter keeps only items that pass the conditional
    setDriverInfoList(prev => prev.filter(d => d.selectedDriver !== driverId));
  };

    return (
        <>
        <div id='nextSession' className="gridChild nextSession">
            <NextSession/>
          </div>

            <div id='driverStandings' className='gridChild driverStandings'>
                <DriverStandings onDriverClick={handleDriverClick} />
            </div>

            {/* Render each driverInfo by passing in and mapping driverInfoList */}
            {driverInfoList.map(driverInfo =>(
                <div key={driverInfo.selectedDriver} data-type="driverInfo" id={`${driverInfo.driverName}`} className='gridChild driverInfo'>
                  {/* This is the closing button to remove the driverInfo gridChild from the render list */}
                  <div className="grid-closer-temp" onClick={() => handleCloseDriver(driverInfo.selectedDriver!)}>{/* Love this '!', tells TS to shutup about "maybe null" */}
                    ✕
                  </div>
                  <DriverInfo selectedDriver={driverInfo.selectedDriver} selectedDriverName={driverInfo.driverName}/>
                </div>
            ))}



            {/* Conditionally render the driver info window */}
            {/* Can be some issues with grab rendering (and probably other stuff too) */}
            {/* Maybe add logic to unappend from dom on close or something?? */}
            {/* {selectedDriver && (
                <div id='driverInfo' className="gridChild driverInfo fade-in-scale">
                    <DriverInfo selectedDriver={selectedDriver} />
                </div>
            )} */}


                        {/* const componentsConfig = [
              { Component: SomeComponent, props: { name: 'A' } },
              { Component: SomeComponent, props: { name: 'B' } },
            ];          

            function Controller() {
              return (
                <>
                  {componentsConfig.map(({ Component, props }, i) => (
                    <Component key={i} {...props} />
                  ))} </> );} */}

        </>
    );
}
