/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                 *
 ********************************************************************************/

import {
  Container,
  Button,
  Typography,
  CssBaseline,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { updateVaccinationDetails, fetchRegistrationDetails, fetchExistingSlots } from "../../services/vaccineRegistration";
import { errorCodes } from "../../helpers/error"
import { toast } from 'react-toastify';


const EditVaccineRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const [vaccineCenter, setVaccineCenter] = useState([])
  const [vCenter, setVCenter] = useState('')
  const [vDate, setVDate] = useState('')
  const [vTime, setVTime] = useState('')
  const [vMins, setVMins] = useState('')
  const [nric, setNric] = useState('')
  const [name, setName] = useState('')
  const [dateSlots, setDateSlots] = useState([])
  const [selTimeSlots, setSelTimeSlots] = useState([])
  const [minSlots, setMinSlots] = useState([])
  const [progress, setProgress] = useState(false)
  const [existSlots, setExistSlots] = useState({
    minSlots: [], timeSlots: []
  })
  const registerId = location.state.registerId

  const handleSelectionInput =async (event, type) => {
    switch (type) {
      case 'vaccineCenter':
        setProgress(true)
        setVCenter(event.target.value)
        let existingSlots = await fetchExistingSlots({ vaccineDate: vDate, vaccineCenter: event.target.value })
        if (existingSlots.status) {
          setExistSlots(existingSlots.data.existingSlots)
        } else {
          toast.error(errorCodes[existingSlots.data.code], {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }
        setProgress(false)
        break;
      case 'hours':
        setVTime(event.target.value)
        break;
      case 'mins':
        setVMins(event.target.value)
        break;
      case 'date':
        setVDate(event.target.value)
        break;
      default:
        break;
    }
  }


  const updateVaccination = async () => {
    setProgress(true)
    const data = {
      vaccineCenter: vCenter,
      vaccineDate: vDate,
      vaccineTime: vTime,
      vaccineMin: vMins,
      nric: nric,
      name: name,
    }
    let response = await updateVaccinationDetails(data)
    if (response.status) {
      setProgress(false)
      navigate('/bookings')
    } else {
      toast.error(errorCodes[response.data.code], {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setProgress(false)
    }
  }

  useEffect(() => {
    setProgress(true)
    const fetchRegistrationDetail = async () => {
      let responseRegistrationDetails = await fetchRegistrationDetails({ id: registerId })
      if (responseRegistrationDetails.status) {
        let responseDetails = responseRegistrationDetails.data.response
        setVaccineCenter(responseDetails.vaccineCenterList)
        setDateSlots(responseDetails.dateSlots)
        setSelTimeSlots(responseDetails.timeSlots)
        setMinSlots(responseDetails.minutesSlots)
        setNric(responseDetails.registrationDetails.nric)
        setName(responseDetails.registrationDetails.name)
        setVCenter(responseDetails.registrationDetails.vaccineCenter.code)
        setVTime(responseDetails.registrationDetails.timeSlots.code)
        setVMins(responseDetails.registrationDetails.minSlots.code)
        setVDate(responseDetails.registrationDetails.date)
      } else {
        toast.error(errorCodes[responseRegistrationDetails.data.code], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      let responseDetails = responseRegistrationDetails.data.response
      let existingSlots = await fetchExistingSlots({ vaccineDate: responseDetails.registrationDetails.date, vaccineCenter: responseDetails.registrationDetails.vaccineCenter.code })
      if (existingSlots.status) {
        setExistSlots(existingSlots.data.existingSlots)
      } else {
        toast.error(errorCodes[existingSlots.data.code], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
      setProgress(false)
    }
    fetchRegistrationDetail()

  }, [registerId])
  return (
    <React.Fragment>
      <CssBaseline />
      {progress ? <LinearProgress /> : ''}
      <Container>
        <Typography component="h1" variant="h5">
          Edit Registration
        </Typography>
        <TextField
          disabled
          margin="normal"
          required
          fullWidth
          id="nric"
          label="NRIC Number"
          name="NRIC"
          autoComplete="nric"
          onInput={(e) => setNric(e.target.value)}
          value={nric}
          sx={{ mb: 2 }}
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="Name"
          autoComplete="name"
          onInput={(e) => setName(e.target.value)}
          value={name}
          sx={{ mb: 2 }}
          autoFocus
        />
        <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
        <Select
          labelId="vaccineCenterLabel"
          label="Vaccine Center"
          required
          fullWidth
          id="vaccineCenter"
          value={vCenter}
          onChange={e => handleSelectionInput(e, "vaccineCenter")}
          sx={{ mb: 2 }}
        >
          {vaccineCenter.map((v) => {
            return <MenuItem key={v.vCenterCode} name="vaccineCenter" value={v.vCenterCode}>{v.vCenterName}</MenuItem>;
          })}
        </Select>
        <InputLabel id="dateSelectLabel">Date</InputLabel>
        <Select
          labelId="dateSelectLabel"
          label="Date"
          required
          fullWidth
          id="date"
          value={vDate}
          onChange={e => handleSelectionInput(e, "date")}
          sx={{ mb: 2 }}
        >
          {dateSlots.map((v, index) => {
            return <MenuItem key={index} name="hours" value={v}>{v}</MenuItem>;
          })}
        </Select>
        <InputLabel id="hourSelectLabel">Hours</InputLabel>
        <Select
          labelId="hourSelectLabel"
          label="Hours"
          required
          fullWidth
          id="hours"
          value={vTime}
          onChange={e => handleSelectionInput(e, "hours")}
          sx={{ mb: 2 }}
        >
          {selTimeSlots.map((v) => {
            return <MenuItem disabled={existSlots.timeSlots.includes(v.code) ? true : false} key={v.code} name="hours" value={v.code}>{v.time}</MenuItem>;
          })}
        </Select>
        <InputLabel id="minsSelectLabel">Minutes</InputLabel>
        <Select
          labelId="minsSelectLabel"
          label="Mins"
          required
          fullWidth
          id="mins"
          value={vMins}
          onChange={e => handleSelectionInput(e, "mins")}
          sx={{ mb: 2 }}
        >
          {minSlots.map((v) => {
            return <MenuItem disabled={existSlots.minSlots.includes(v.code) ? true : false} key={v.code} name="mins" value={v.code}>{v.mins}</MenuItem>;
          })}
        </Select>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={(e) => updateVaccination(e)}
        >
          Register!
        </Button>

      </Container>
    </React.Fragment>
  );
}

export default EditVaccineRegistration