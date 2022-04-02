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
  Grid,
  LinearProgress
} from "@mui/material";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import { fetchVaccineCenterList } from '../../services/vaccineCenter'
import { fetchTimeSlots } from "../../services/timeSlots";
import { registerVaccination } from "../../services/vaccineRegistration";


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
  const [vaccineCenter, setVaccineCenter] = useState([])
  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [vCenter, setVCenter] = useState('');
  const [vDate, setVDate] = useState('');
  const [vTime, setVTime] = useState('');
  const [vMins, setVMins] = useState('');
  const [nric, setNric] = useState('');
  const [name, setName] = useState('');
  const [selTimeSlots, setSelTimeSlots] = useState([])
  const [minSlots, setMinSlots] = useState([])
  const [dateSlots, setDateSlots] = useState([])
  const [progress, setProgress] = useState(false)

  const handleClickOpen = async (param, date) => {
    setProgress(true)
    setVCenter(param.center.code)
    setVDate(date)
    setOpen(true)
    setTimeOpen(false)
    let timeSlots = await fetchTimeSlots()
    if (timeSlots.status) {
      setMinSlots(timeSlots.data.minutesSlots)
      setSelTimeSlots(timeSlots.data.timeSlots)
    } else {
      alert(timeSlots.data.response.code)
    }
    setProgress(false)
  };
  const handleClose = async () => {
    setVDate('')
    setOpen(false)
    setTimeOpen(false)
  };

  const openTimeSlot = (event, val) => {
    setTimeOpen(true)
    setVTime(val)
  }

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
    await registerVaccination(data)
  }

  useEffect(() => {
    setProgress(true)
    const fetchCategoryVariantList = async () => {
      let categoryVariants = await fetchVaccineCenterList({})
      if (categoryVariants.status) {
        setVaccineCenter(categoryVariants.data.response.vaccineCenters)
        setDateSlots(categoryVariants.data.response.dateSlots)
      } else {
        alert(categoryVariants.data.response.code)
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
          Click on the Available Slots
        </Typography>
        <table>
          <thead>
            <tr>
              <th>Vaccine Centers</th>
              <th>30 Mar 2022</th>
              <th>31 Mar 2022</th>
              <th>01 Apr 2022</th>
            </tr>
          </thead>
          <tbody>
            {vaccineCenter.map((v, index) => {
              return (
                <tr key={index}>
                  <td data-column="Vaccine Center Name">{v.vCenterName}</td>
                  {dateSlots.map((d, ind) => { return <td key={ind} data-column="Slot Available"><Button variant="contained" color="success" onClick={(e) => handleClickOpen(v, d, e)}>{v[d]}</Button></td> })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Container>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <React.Fragment>
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            Modal title
          </BootstrapDialogTitle>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              {selTimeSlots.map((t, index) => {
                return <Grid key={index} item xs="auto">
                  <Button key={index} variant="outlined" color="success" style={{ width: 180, height: 50 }} onClick={(e) => openTimeSlot(e, t.code)}>{t.time}</Button>
                </Grid>
              })}
            </Grid>
          </Box>
        </React.Fragment>
        {timeOpen ? <React.Fragment>
          <Container>
            <Box
              component="form"
              sx={{
                mt: 8,
              }}
            >
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
              <InputLabel id="vaccineCenterLabel">Vaccine Slot Picker</InputLabel>
              <Grid container spacing={3}>
                {minSlots.map((t, index) => {
                  return <Grid key={index} item xs="auto">
                    <Button key={index} variant="outlined" color="success" style={{ width: 180, height: 50 }} onClick={(e) => setVMins(t.code)}>{t.mins} </Button>
                  </Grid>
                })}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={regVaccination()}
              >
                Register!
              </Button>
            </Box>
          </Container>
        </React.Fragment> : ''
        }
      </BootstrapDialog >
    </React.Fragment >
  );
}

export default VaccineRegistration
