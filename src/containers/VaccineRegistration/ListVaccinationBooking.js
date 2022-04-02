/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                 *
 ********************************************************************************/

import {
  Table,
  Box,
  Button,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
  LinearProgress
} from "@mui/material";
import { Link } from 'react-router-dom';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import { regstrationList } from "../../services/registrationList"
import { deleteRegistration } from "../../services/vaccineRegistration"
import { errorCodes } from "../../helpers/error"
import { toast } from 'react-toastify';

const VaccineRegistrationListing = () => {
  // State Declarations
  const [progress, setProgress] = useState(false)
  const [vaccineRegistrationList, setVaccineRegistrationList] = useState([])

  //Mounting Phase
  useEffect(() => {
    setProgress(true)
    //Function to fetch registration details
    const fetchRegistrationList = async () => {
      let vaccineRegistrations = await regstrationList({})
      if (vaccineRegistrations.status) {
        setVaccineRegistrationList(vaccineRegistrations.data.response)
      } else {
        toast.error(errorCodes[vaccineRegistrations.data.code], {
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
    fetchRegistrationList()
  }, []);

  //Function to delete registration
  const deleteVaccineRegistration = async (id) => {
    let deletedResponse = await deleteRegistration({ id })
    if (deletedResponse.status) {
      setVaccineRegistrationList(deletedResponse.data.response)
    } else {
      toast.error(errorCodes[deletedResponse.data.code], {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      {progress ? <LinearProgress /> : ''}
      <Container>
        <Box sx={{ mt: 8 }}>
          <Typography component="h1" variant="h5">
            Active Booking
          </Typography>
          <TableContainer component={Box}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Center Name</TableCell>
                  <TableCell align="left">Start Time</TableCell>
                  <TableCell align="left">&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vaccineRegistrationList.map((row) => (
                  <TableRow
                    key={row.objectId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.vaccineCenter.name}</TableCell>
                    <TableCell align="left">
                      {moment(row.date, "DD-MM-YYYY").add(row.timeSlots.time.split('-')[0].includes('AM') ? row.timeSlots.time.split('-')[0].split('AM')[0] : row.timeSlots.time.split('-')[0].split('PM')[0], 'hours').add(row.minSlots.mins.split('-')[0].split(':')[1].trim(), 'minutes').toString()}
                    </TableCell>
                    <TableCell align="left">
                      <Button component={Link} to={`/bookings/${row.objectId}`} state={{ registerId: row.objectId }}>
                        <ModeEditIcon />
                      </Button>
                      <Button onClick={() => deleteVaccineRegistration(row.objectId)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default VaccineRegistrationListing
