import './index.css'
import { TableDriverInfoController } from './Controller/controller';
import { NextSession } from './NextSession';

function App() {
  return (
    <>
      <div className='flex flex-col gap-1'>
        <NextSession/>
        <TableDriverInfoController/>
      </div>
    </>
  );
}

export default App
