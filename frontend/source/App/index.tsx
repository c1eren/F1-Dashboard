import { useState } from 'react';
import { Guy } from './guy';

const baseURL:string = './test/frames/';
const baseFrame:string = baseURL+'front_on_new_standardised.png';

function App() {
  const [guyFrame, setGuyFrame] = useState<string>(baseURL+'front_on_new_standardised.png');
  
  function toBaseFrame() {
    setTimeout(() => {
      setGuyFrame(baseFrame);
    }, 50);
  }

  return (
    <>
      <div className='border-5 p-5 h-screen w-screen flex justify-around '>
        <div className='h-fit w-70 border'
        onMouseEnter={() => {setGuyFrame(baseURL+'point_left_standardised.png')}}
        onMouseLeave={() => {toBaseFrame()}}
        >
          <p className='border'>Boroondara Hard Rubbish Rehome</p>
          <a className='hover:brightness-110' href='https://bhrr.org.au/' target='none'>
            <img src={'./test/siteScreenshots/bhrr.png'} />
          </a>
        </div>
        <>
        {/* Would probably set some breakpoints or clamp for the guy sizing */}
        <div className='relative self-center w-fit h-2/3'>
        <Guy frame={guyFrame}/>
        </div>
        </>
        <div className='h-fit w-70 border'
        onMouseEnter={() => {setGuyFrame(baseURL+'point_right_standardised.png')}}
        onMouseLeave={() => {toBaseFrame()}}
        >
          <p className='border'>Formula 1 Dashboard</p>
          <a className='hover:brightness-110' href='' target='none'>
            <img src={'./test/siteScreenshots/f1Webapp.png'} />
          </a>
        </div>        
      </div>
    </>
  );
}

export default App;
