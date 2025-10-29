import './grid.css'
import { useEffect } from 'react';
import { TableDriverInfoController } from './Controller/controller';
import { NextSession } from './NextSession';

function App() {
  // Wait till app mounts

  useEffect(() => {
    //@ts-expect-error Ihateyoutypescript
    import('./grid.js');
  }, []);

  return (
    <>
      <div className='gridContainer'>

        <div className="gridChild">
          <NextSession/>
        </div>
        
        <TableDriverInfoController/>

        {/* <div className='gridChild bg-amber-500 h-10 w-10'></div> */}
      </div>
    </>
  );
}

export default App
