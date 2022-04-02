/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                 *
 ********************************************************************************/

import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VaccineRegistration from './containers/VaccineRegistration/VaccineRegistration';
import VaccineRegistrationListing from './containers/VaccineRegistration/ListVaccinationBooking';
import EditVaccineRegistration from './containers/VaccineRegistration/EditVaccinationBooking';
import { NavBar } from './containers/Nav';
import { Component } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';


class App extends Component {
  componentDidMount() {
    document.title = 'Vaccination Center';
  }
  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/bookings" element={<VaccineRegistrationListing/>} />
            <Route path="/bookings/:bookingId" element={<EditVaccineRegistration/>} />
            <Route path="/" element={<VaccineRegistration/>} />
          </Routes>
        </Router>
      </LocalizationProvider>
    )
  }
}


export default App;
