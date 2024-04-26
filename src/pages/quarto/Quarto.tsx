import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Icon, IconButton, TableFooter, LinearProgress, Button, TextField } from '@mui/material';
import {MyModalAgendar} from '../../shared/components/modal/ModalAgendar';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useAuthContext } from '../../shared/contexts';
import {Api} from '../../shared/services/api/Index'
import { toast } from 'react-toastify';

interface QuartoData {
  id: number;
  numero: string;
  descricao: string;
  preco: number;
  estado: string;
  tipo: string;
}

export const Quarto: React.FC = () => {

  const formatDate = (dateString: Date) => {
    const date = dateString;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
};

    const notify = () => toast.success('Solicitação enviada!', { autoClose: 2000, position: 'bottom-right' });

    const { idUsuario } = useAuthContext();

    const [quartos, setQuartos] = useState<QuartoData[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [visivelModal, setVisivelModal] = useState(false)
    const [quarto, setQuarto] = useState(-1)
    const [data_in, setData_in] = useState(new Date())
    const [data_out, setData_out] = useState(new Date())
    const [data1, setData1] = useState(new Date())
    const [data2, setData2] = useState(new Date())

  const abrirModal = (id: number) => {
    setQuarto(id)
    setVisivelModal(true)
  }

  const reservarQuarto = () => {
    Api.post('/reserva/', {
        data_out: formatDate(data_out),
        data_in: formatDate(data_in),
        id_cliente: idUsuario,
        id_funcionario: null,
        id_quarto: quarto,
    })
      .then(response => {
        console.log(response)
        notify()
      })
      .catch(error => {
        console.error('Erro ao enviar a solicitação:', error);
    });
    setVisivelModal(false)
  }

  const carregarDisponibilidades = () => {
    setIsLoading(true);
  
    try {
      Api.post('/ver_disponibilidade/', {
        data_in: data1,
        data_out: data2
      }).then(response => {
        const quartosData = response.data[0];
        setQuartos(quartosData);
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Erro ao buscar os quartos:', error);
      });
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      setIsLoading(false);
    }
  };
  
  const carregarQuartos = async () => {
    try {
      const response = await Api.get<QuartoData[]>('/');
      setQuartos(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar os quartos:', error);
    }
  };
  

  useEffect(() => {
  
    // Chamar carregarQuartos imediatamente
    carregarQuartos();
  
    // Chamar carregarQuartos a cada 1 minuto
    const intervalId = setInterval(carregarQuartos, 60000);
  
    // Limpar o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, []);
  

  return (
    <LayoutBaseDePagina
      titulo='Quartos'
      barraDeFerramentas={
        <FerramentasDaListagem 
          mostrarInputBusca={true} 
          mostrarBotaoNovo={false}
          aoClicarEmPesquisar={carregarDisponibilidades}
          aoMudarDatain={(novaData)=>setData1(novaData)}
          aoMudarDataout={(novaData)=>setData2(novaData)}
      />}
    >
      <Box width='100%' display='flex'>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Solicitar</TableCell>
                <TableCell>Quarto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quartos.map(quarto => (
                <TableRow key={quarto.id}>
                  <TableCell><IconButton onClick={()=>abrirModal(Number(quarto.id))} color='primary'><Icon>send</Icon></IconButton></TableCell>
                  <TableCell>{quarto.numero}</TableCell>
                  <TableCell>{quarto.tipo}</TableCell>
                  <TableCell>{quarto.descricao}</TableCell>
                  <TableCell>{quarto.preco}</TableCell>
                  <TableCell>{quarto.estado}</TableCell>
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
      <MyModalAgendar
        open={visivelModal}
        onClose={()=>setVisivelModal(false)}
      >
        <TextField 
            label="Data de ckeck-in"
            type="date"
            fullWidth
            sx={{marginBottom: 2}}
            InputLabelProps={{ shrink: true }} 
            onChange={(e)=>setData_in(new Date(e.target.value))}
            size="small"
        />
        <TextField 
            label="Data de ckeck-out"
            type="date"
            fullWidth
            sx={{marginBottom: 2}}
            InputLabelProps={{ shrink: true }} 
            onChange={(e)=>setData_out(new Date(e.target.value))}
            size="small"
        />
        <Button
            color='primary'
            disableElevation
            variant='contained'
            onClick={reservarQuarto}
            endIcon={<Icon>send</Icon>}
        >Solicitar</Button>
      </MyModalAgendar>
    </LayoutBaseDePagina>
  );
};
