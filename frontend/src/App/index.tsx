
// import './styles/basic.css'
import './styles/modern-dark.css'
import './styles/template.css'
import './gridStructure.css'
import { useEffect } from 'react';
import { UIContainer } from './UI/index.js';
import { TableDriverInfoController } from './Controller/controller';


function App() {
  useEffect(() => {
    //@ts-expect-error yippee
    import('./grid.js');
  }, []);

  return (
    <>
      {/* Main */}
      <div className='main flex max-w-screen max-h-screen overflow-hidden'>
        
        {/* UI Container */}
        <UIContainer/>
        
        <div className='gridContainer overflow-scroll' data-cellsize="25">

          <TableDriverInfoController/>

        </div>
      </div>
    </>
  );
}

export default App;



// // import './grid.css';
// import './index.css'
// import './gridStyle.css'
// import './gridStructure.css'
// import { useEffect } from 'react';
// import { TableDriverInfoController } from './Controller/controller';
// import { NextSession } from './NextSession';

// function App() {
//   // Wait till app mounts
  
//   useEffect(() => {
//     //@ts-expect-error asdsadsad
//     import('./grid.js');
//   }, []);

//   return (
//     <>
//     <div className='main flex max-w-screen max-h-screen overflow-hidden '>
//       <div className='UIContainer'>

//         {/* <div className='UIRow col-span-2 h-20 bg-gradient-to-r from-green-300 to-emerald-500 flex 
//                         items-center justify-center text-5xl font-bold'>
//           <span>F1 Dashboard</span>
//         </div> */}

//         <div className='UICol flex flex-col gap-10 py-10 px-2 h-screen w-40 bg-gradient-to-l from-gray-900 to-gray-850 items-start justify-start text-5xl font-bold'>

//           {/* <label htmlFor="cellOptions" className='border w-full text-sm rounded-sm bg-transparent'>beans</label> */}
//           <div className='border-1 flex flex-col w-full items-start gap-1 p-1 rounded-sm'>  
//             <div className=" text-sm rounded-sm">Cell size</div>
//             <select id="cellSizeOption" name="cellOptions" className='w-full text-sm rounded-sm bg-gray-900'>
//               <option value="10">10px</option>
//               <option value="50" selected>50px</option> {/* Default selection */}
//               <option value="100">100px</option>
//             </select>
//           </div>
          
//           <div className='buttons'>
//             <button id='driverStandingsButton' value='driverStandingsComponent' className='componentToggles border w-full h-10 text-xs text-nowrap rounded-sm'>Driver Standings</button>
//             <button id='nextSessionButton' value='nextSessionComponent'     className='componentToggles border w-full h-10 text-xs text-nowrap rounded-sm'>Upcoming Sessions</button>
//           </div>

//         </div>

//       </div>

//         <div className='gridContainer overflow-scroll border-2 border-pink-400'>

//           <div id='nextSessionComponent' className="gridChild min-h-[300px] min-w-[400px] sm:min-h-[300px]">
//             <NextSession/>
//           </div>

//           <TableDriverInfoController/>

//           {/* <div className='gridChild bg-amber-500 h-10 w-10'></div> */}
//         </div>
//     </div>
//     </>
//   );
// }

// export default App
