import './css/App.css'
import { DriverStandingsComponent } from './assets/components/standingsPerYear/driverStandings';
import { DriverInfo } from './assets/components/driver/driver';


function App() {
  return (
    <>

    {/* <div className='p-25'>
      <DriverStandingsComponent/>
    </div> */}

    <div>
      <DriverInfo/>
    </div>
    
    </>
  );
}

export default App
