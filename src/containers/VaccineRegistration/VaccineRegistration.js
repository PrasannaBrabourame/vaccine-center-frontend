/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  28 Mar 2021                                                  *
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
  Select,
  MenuItem,
  InputLabel,
  Grid
} from "@mui/material";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import { fetchVaccineCenterList } from '../../services/vaccineCenter'
import { fetchTimeSlots } from "../../services/timeSlots";


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
  const [vDate, setVDate] = useState('');
  const [selTimeSlots, setSelTimeSlots] = useState([])
  const [minSlots, setMinSlots] = useState([])

  const handleClickOpen = async (param, date) => {
    setVDate(date)
    setOpen(true)
    setTimeOpen(false)
    let timeSlots = await fetchTimeSlots()
    if (timeSlots.status) {
      setMinSlots(timeSlots.data.minutesSlots)
      setSelTimeSlots(timeSlots.data.timeSlots)
    }
    console.log(timeSlots)

  };
  const handleClose = async () => {
    setVDate('')
    setOpen(false)
    setTimeOpen(false)

  };

  const openTimeSlot = (event, val) => {
    setTimeOpen(true)
  }
  useEffect(() => {
    const fetchCategoryVariantList = async () => {
      let categoryVariants = await fetchVaccineCenterList({})
      if (categoryVariants.status)
        setVaccineCenter(categoryVariants.data.response)
    }
    fetchCategoryVariantList()

  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
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
                  <td data-column="Slot Available"><Button variant="contained" color="success" onClick={(e) => handleClickOpen(v, e)}>{v['30-03-2022']}</Button></td>
                  <td data-column="Slot Available"><Button variant="contained" color="success" onClick={(e) => handleClickOpen(v, e)}>{v['31-03-2022']}</Button></td>
                  <td data-column="Slot Available"><Button variant="contained" color="success" onClick={(e) => handleClickOpen(v, e)}>{v['01-04-2022']}</Button></td>
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
                sx={{ mb: 2 }}
                autoFocus
              />
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                sx={{ mb: 2 }}
              />
              <InputLabel id="vaccineCenterLabel">Vaccine Slot Picker</InputLabel>
              <Select
                labelId="vaccineCenterLabel"
                label="Vaccine Center"
                required
                fullWidth
                id="vaccineCenter"
                value={[]}
                onChange={console.log(1)}
                sx={{ mb: 2 }}
              ><Grid container spacing={3}>
                  <Grid item xs="auto">
                    <Button variant="outlined" color="success" style={{ width: 180, height: 50 }} onClick={(e) => openTimeSlot(e)}>00:00 - 00:10 </Button>
                  </Grid>
                  <Grid item xs="auto">
                    <Button variant="outlined" color="success" style={{ width: 180, height: 50 }} onClick={(e) => openTimeSlot(e)}>00:10 - 00:20 </Button>
                  </Grid>
                  <Grid item xs="auto">
                    <Button variant="outlined" color="success" style={{ width: 180, height: 50 }} onClick={(e) => openTimeSlot(e)}>00:20 - 00:30 </Button>
                  </Grid>
                  <Grid item xs="auto">
                    <Button variant="outlined" color="success" style={{ width: 180, height: 50 }} onClick={(e) => openTimeSlot(e)}>00:30 - 00:40 </Button>
                  </Grid>
                  <Grid item xs="auto">
                    <Button variant="outlined" color="success" style={{ width: 180, height: 50 }} onClick={(e) => openTimeSlot(e)}>00:40 - 00:50 </Button>
                  </Grid>
                  <Grid item xs="auto">
                    <Button variant="outlined" color="success" style={{ width: 180, height: 50 }} onClick={(e) => openTimeSlot(e)}>00:50 - 00:60 </Button>
                  </Grid>
                </Grid>
              </Select>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register!
              </Button>
            </Box>
          </Container>
        </React.Fragment> : ''}
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default VaccineRegistration
