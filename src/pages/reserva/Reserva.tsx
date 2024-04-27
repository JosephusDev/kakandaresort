import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Icon, IconButton, TableFooter, LinearProgress, Button, TextField, Typography } from '@mui/material';
import { LayoutBaseDePagina } from '../../shared/layouts';
import {Api} from '../../shared/services/api/Index';
import { MyModalEliminar } from '../../shared/components';
import { useAuthContext } from '../../shared/contexts';
import { toast } from 'react-toastify';


interface ReservaData {
  id_reserva: number;
  numero: string;
  estado: string;
  data_out: string;
  data_in: string;
  dias: number;
  total: number;
}

export const Reserva: React.FC = () => {

    const notify = () => toast.error('Reserva cancelada!', { autoClose: 2000, position: 'bottom-right' });
    const { idUsuario } = useAuthContext();

    const [reservas, setReservas] = useState<ReservaData[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [modalVisivel, setModalVisivel] = useState(false)
    const [reserva, setReserva] = useState(-1)

    const abrirModal = (id: number) => {
        setReserva(id)
        setModalVisivel(true)
    }

    const formatDate = (dateString: string) => {
      const [year, month, day] = dateString.split('-');
      // Note que estamos subtraindo 1 do mês, pois os meses em JavaScript começam do zero (janeiro é 0)
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const formattedDay = date.getDate().toString().padStart(2, '0');
      const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
      const formattedYear = date.getFullYear();
      
      return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };
  

    const elimReserva = () => {
        Api.delete(`/reserva/${reserva}`)
      .then(response => {
        notify()
        setModalVisivel(false)
        carregarReservas()
      })
      .catch(error => {
        console.error('Erro ao buscar as reservas:', error);
      });
    }

    const carregarReservas = () => {
        Api.get<ReservaData[]>(`/reserva/cliente/${idUsuario}`)
        .then(response => {
          setReservas(response.data);
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Erro ao buscar as reservas:', error);
        });
    }

  useEffect(() => {
    carregarReservas()
  }, [reservas]);

  return (
    <LayoutBaseDePagina
      titulo='Reservas'
    >
      <Box width='100%' display='flex'>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Eliminar</TableCell>
                <TableCell>Quarto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Dias</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservas.map(reserva => (
                <TableRow key={reserva.id_reserva}>
                  <TableCell><IconButton disabled={reserva.estado === 'pendente' ? false : true} onClick={()=>abrirModal(reserva.id_reserva)} color='primary'><Icon>delete</Icon></IconButton></TableCell>
                  <TableCell>{reserva.numero}</TableCell>
                  <TableCell>{reserva.estado}</TableCell>
                  <TableCell>{formatDate(reserva.data_in)}</TableCell>
                  <TableCell>{formatDate(reserva.data_out)}</TableCell>
                  <TableCell>{reserva.dias}</TableCell>
                  <TableCell>{reserva.total.toLocaleString('pt-BR', { style: 'currency', currency: 'AOA' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
                {isLoading && (
                    <TableRow>
                        <TableCell  align="center" colSpan={9}>
                            <LinearProgress variant='indeterminate'/>
                        </TableCell>
                    </TableRow>
                )}
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
      <MyModalEliminar
        open={modalVisivel}
        onClose={()=>setModalVisivel(false)}
      >
        <Typography 
            variant='h6'
            sx={{paddingY: 2}}
        >
            Deseja eliminar a reserva?
        </Typography>
        <Button
            color='primary'
            disableElevation
            variant='contained'
            onClick={elimReserva}
            endIcon={<Icon>delete</Icon>}
        >Eliminar</Button>
      </MyModalEliminar>
    </LayoutBaseDePagina>
  );
};
