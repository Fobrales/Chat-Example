import User from './components/User'


function App() {

  return (
      <div className="mx-auto" style={{width: '50%'}}>
        <User />
        <div id="info"></div>
        <div id="chat" className="d-flex flex-column"></div>
        <div id="send"></div>
        </div>
  );
}

export default App;
