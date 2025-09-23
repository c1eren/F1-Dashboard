import './css/App.css'
//import { DriverStandingsComponent } from './assets/components/standingsPerYear/driverStandings';
import {Box} from './assets/components/containers/box';
import {GridContainer} from './assets/components/containers/gridContainer';
import {TestTableLarge, TestTableMedium, TestTableSmall} from './assets/components/test/testComponents';

function App() {
  return (
    <>
    <GridContainer columns={20} rows={20}>
      <Box><TestTableMedium/></Box>
      <Box><TestTableSmall/></Box>
      <Box><TestTableMedium/></Box>
      <Box><TestTableLarge/></Box>
      <Box><TestTableSmall/></Box>
    </GridContainer>
    </>
  );
}

export default App
