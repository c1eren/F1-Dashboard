import './index.css'
import { useEffect } from 'react';
import { TableDriverInfoController } from './Controller/controller';
import { NextSession } from './NextSession';

function App() {
  // Wait till app mounts

  useEffect(() => {
    //@ts-expect-error Ihateyoutypescript
    import('./window.js');
  }, []);

  return (
    <>
      <div className='bentoContainer items-start justify-start flex flex-col gap-1'>

        <div className="windowAble">
          <NextSession/>
        </div>
        
        <TableDriverInfoController/>
      </div>
    </>
  );
}

export default App
