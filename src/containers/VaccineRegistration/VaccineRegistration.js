/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                 *
 ********************************************************************************/

import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  DialogTitle,
  Dialog,
  TextField,
  InputLabel,
  LinearProgress,
  Select,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import { fetchVaccineCenterList } from '../../services/vaccineCenter'
import { fetchTimeSlots } from "../../services/timeSlots";
import { registerVaccination, fetchExistingSlots } from "../../services/vaccineRegistration";
import { errorCodes } from "../../helpers/error"
import { toast } from 'react-toastify';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const VaccineRegistration = () => {
  const navigate = useNavigate();
  const [vaccineCenter, setVaccineCenter] = useState([])
  const [open, setOpen] = useState(false);
  const [vCenter, setVCenter] = useState('');
  const [vDate, setVDate] = useState('');
  const [vTime, setVTime] = useState('');
  const [vMins, setVMins] = useState('');
  const [nric, setNric] = useState('');
  const [name, setName] = useState('');
  const [selTimeSlots, setSelTimeSlots] = useState([])
  const [minSlots, setMinSlots] = useState([])
  const [dateSlots, setDateSlots] = useState([])
  const [existSlots, setExistSlots] = useState({
    minSlots: [], timeSlots: []
  })
  const [progress, setProgress] = useState(false)

  const handleClickOpen = async (param, date) => {
    setProgress(true)
    setVCenter(param.center.code)
    setVDate(date)
    setOpen(true)
    let existingSlots = await fetchExistingSlots({ vaccineDate: date, vaccineCenter: param.center.code })
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
    let timeSlots = await fetchTimeSlots()
    if (timeSlots.status) {
      setMinSlots(timeSlots.data.minutesSlots)
      setSelTimeSlots(timeSlots.data.timeSlots)
    } else {
      toast.error(errorCodes[timeSlots.data.code], {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
    setProgress(false)
  };

  const handleSelectionInput = (event, type) => {
    switch (type) {
      case 'vaccineCenter':
        setVCenter(event.target.value)
        break;
      case 'hours':
        setVTime(event.target.value)
        break;
      case 'mins':
        setVMins(event.target.value)
        break;
      default:
        break;
    }
  }

  const handleClose = async () => {
    setVDate('')
    setOpen(false)
  };


  const regVaccination = async () => {
    setProgress(true)
    const data = {
      vaccineCenter: vCenter,
      vaccineDate: vDate,
      vaccineTime: vTime,
      vaccineMin: vMins,
      nric: nric,
      name: name,
    }
    let response = await registerVaccination(data)
    if (response.status) {
      setOpen(false)
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
    const fetchCategoryVariantList = async () => {
      let categoryVariants = await fetchVaccineCenterList({})
      if (categoryVariants.status) {
        setVaccineCenter(categoryVariants.data.response.vaccineCenters)
        setDateSlots(categoryVariants.data.response.dateSlots)
      } else {
        toast.error(errorCodes[categoryVariants.data.code], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setProgress(false)
    }
    fetchCategoryVariantList()
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      {progress ? <LinearProgress /> : ''}
      <Container>
        <Typography component="h1" variant="h5">
          Click on the Available Dates for Vaccine Registration
        </Typography>
        <table>
          <thead>
            <tr>
              <th>Vaccine Centers</th>
              {dateSlots.map((d, ind) => { return <th key={ind}>{d}</th> })}
            </tr>
          </thead>
          <tbody>
            {vaccineCenter.map((v, index) => {
              return (
                <tr key={index}>
                  <td data-column="Vaccine Center Name">{v.vCenterName}</td>
                  {dateSlots.map((d, ind) => { return <td key={ind} data-column="Slot Available"><Button variant="contained" disabled={!v.dates[d].nurse} color={v.dates[d].nurse ? "success" : "error"} onClick={(e) => handleClickOpen(v, d, e)}>{v.dates[d].nurse ? v.dates[d].dates : "NA"}</Button></td> })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Button
          variant="contained"
          color="success"
        >
          Available Slots
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={true}
        >
          Nurses Not Available
        </Button>
      </Container>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <React.Fragment>
          <Container>
            <Box sx={{ flexGrow: 1 }}>
              <Typography component="h1" variant="h5">
                Book a slot
              </Typography>
              <TextField
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
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                onInput={(e) => setName(e.target.value)}
                value={name}
                autoComplete="name"
                sx={{ mb: 2 }}
              />
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
                onClick={() => regVaccination()}
              >
                Register!
              </Button>
            </Box>
          </Container>
        </React.Fragment>
      </BootstrapDialog >
    </React.Fragment >
  );
}

export default VaccineRegistration
