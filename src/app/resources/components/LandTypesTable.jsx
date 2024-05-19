import React from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    landscape_types_details
} from '../../utils/map/map-utils.js'

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "transparent",
        color: "white",
        borderColor: "white"
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        backgroundColor: "transparent",
        color: 'rgba(222,216,216,0.85)',
        borderColor: "white"
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "transparent"
    },
    '&:last-child td, &:last-child th': {
        border: 0
    },
    backgroundColor: "transparent",
}));

const StyledTableContainer = styled(TableContainer)(({theme}) => ({
    overflowX: 'auto',
    backgroundColor: "transparent",
    boxShadow: "none",
    '& .MuiTable-root': {
        minWidth: 700,
        border: "1px solid white",
    }
}));

export default function CustomizedTables() {
    return (
        <>
            <section className="lg:py-16"
                     style={{
                         width: "60%",
                         marginLeft: 'auto',
                         marginRight: 'auto',
                         paddingBottom: '200px'
                     }}>
                <h1 className="text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl">Types of landscapes</h1>
                <StyledTableContainer component={Paper}>
                    <Table sx={{minWidth: 700}} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                <StyledTableCell align="left">Details</StyledTableCell>
                                <StyledTableCell align="left">Suitable</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {landscape_types_details.map((type) => (
                                <StyledTableRow key={type.id}>
                                    <StyledTableCell component="th" scope="row">
                                        {type.id}
                                    </StyledTableCell>
                                    <StyledTableCell>{type.name}</StyledTableCell>
                                    <StyledTableCell>{type.details}</StyledTableCell>
                                    <StyledTableCell align="right">{type.suitable ? "Yes" : "No"}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </section>
        </>
    );
}