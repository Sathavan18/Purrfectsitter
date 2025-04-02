import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/login';
import OwnerProfilePage from './Pages/OwnerProfile';
import PetBookingPage from './Pages/PetBookingPage';
import MinderProfilePage from './Pages/MinderProfile';
import Signup from './Pages/signup';
import Preferences from './Pages/Preferences';
import EditProfile from './Pages/EditProfile';
import Review from './Pages/review';
import GuestHomePage from './Pages/GuestHomePage'; 
import OwnerHomePage from './Pages/OwnerHomePage';
import MinderHomePage from './Pages/MinderHomePage';
import Notifications from './Pages/notifications';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<GuestHomePage />} />
        <Route path="/login" element={<Login/>} /> 
        <Route path="/review" element={<Review />} />
        <Route path="/ownerprofilepage" element={<OwnerProfilePage/>} />
        <Route path="/minderprofilepage" element={<MinderProfilePage/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/petbookingpage" element={<PetBookingPage/>} />
        <Route path="/preferences" element={<Preferences/>} />
        <Route path="/edit-profile" element={<EditProfile/>} />
        <Route path="/ownerhomepage" element={<OwnerHomePage/>} />
        <Route path="/minderhomepage" element={<MinderHomePage/>} />
        <Route path="/notifications" element={<Notifications/>} />


      </Routes>
    </HashRouter>
  );
}

export default App; 
