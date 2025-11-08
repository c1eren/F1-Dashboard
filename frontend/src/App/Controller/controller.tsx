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
//   const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

  // Store a list of driver info objects
  const [driverInfoList, setDriverInfoList] = useState<DriverInfoProps[]>([]);

//   const addDriver = (driverId: number) => {
//     setDriverInfoList(prev => [...prev, { selectedDriver: driverId }]);
//   };
// Handler for clicking a driver in the standings
  const handleDriverClick = (driverId: number, driverName: string) => {
    // Avoid duplicates if needed
    setDriverInfoList(prev => {
      if (prev.some(d => d.selectedDriver === driverId)) return prev;
      return [...prev, { selectedDriver: driverId, driverName }];
    });
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
                    <DriverInfo selectedDriver={driverInfo.selectedDriver}/>
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
