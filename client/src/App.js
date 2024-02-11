import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LandingPage from './pages/landingPage'
import Login from './components/login'
import AccountSignUp from './components/accountSignUp'

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<LandingPage/>}/>
				<Route path='/signUp' element={<AccountSignUp/>}/>
				<Route path='/login' element={<Login/>}/>
				<Route path='/signUp/:id' element={<AccountSignUp/>}/>
			</Routes>
		</Router>
	)
}

export default App
