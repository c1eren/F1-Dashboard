import './css/App.css'
import './css/index.css'
import { DriverStandingsComponent } from './assets/components/standingsPerYear/driverStandings';

function App() {
  
  return (
    <div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          F1 Standings
        </h1>

      <div className='flex gap-6 justify-start'>
        <div><DriverStandingsComponent /></div>
      </div>
      
      </div>
    </div>
  );
}

export default App
