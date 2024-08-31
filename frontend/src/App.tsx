import Signin from './components/signin'
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Singup from './components/singup';


function App() {
  return (
    <>
    <RecoilRoot>
      <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Singup />} />
      </Routes>
    </Router>
    </RecoilRoot>
    </>
  )
}

export default App
