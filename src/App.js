import React from 'react';
import {load} from './fakeApi';
import VirtualizedTable from './VirtualizedTable';

function App() {
  const [data, setData] = React.useState([]);

  const loadData = React.useCallback(async () => {
    setData(await load());
  }, []);

  return (
    <div className="App">
      <div>
        <button type="button" onClick={loadData} style={{fontSize:'2em'}}>
          Load Data
        </button>

        <VirtualizedTable data={data}>
          <VirtualizedTable.Column
            dataKey="name"
            headerRenderer={() => <span>Name</span>}
            cellRenderer={({cellData}) => <span>{cellData}</span>}
            width={100}
          />
        </VirtualizedTable>
      </div>

      <div style={{width: '90%', marginTop: '20px', marginLeft: '5%', border: '1px solid black', padding: '20px', boxSizing: 'border-box'}}>
        <h2>Instructions</h2>

        <p><em>This is an attempt to demonstrate a condition that looks like a memory leak when using React hooks.</em></p>

        <ol>
          <li>Click the "Load Data" button 10 times.</li>
          <li>Take a memory snapshot in Chrome devtools.</li>
          <li>In the snapshot "Summary" view, use the "Class filter" searchbox to search for "Tracking".</li>
          <li>You should find as many Tracking instances as times you clicked the Load Data button. This represenets the memory leak (The "Tracking" array is data loaded from an API. The data is being retained in memory between renders)</li>
        </ol>

        <p>You should end up seeing something like this:
          <img src="retainers.png" style={{width:'90%'}} />
        </p>

        <p>
          It appears that the combination of hooks / memoization / closures causes all past renders of the react component to be retained in memory,
          including their assocated data array.
          You can see from the memory snapshot how several renders of the component are being retained through the useCallback hook.
        </p>
      </div>
    </div>
  );
}

export default App;
