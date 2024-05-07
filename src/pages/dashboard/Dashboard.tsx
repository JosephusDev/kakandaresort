import { Box, Grid } from '@mui/material';
import { MeuCard } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


export const Dashboard = () => {
    
  return (
    <LayoutBaseDePagina
      titulo='Kakanda Reservas'
    >
      <Box width='100%' display='flex'>
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <MeuCard
                avatar='H'
                imagem='data:image/jpeg;base64,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'
                titulo='O NOSSO HOTEL'
                conteudo='O seu conforto é para nós uma prioridade. Dispomos de 36 quartos (6 Suites, 10 Duplos e 20 Executivos), equipados com Ar Condicionado, Televisão, Wi-fi, Secador de Cabelo, Telefone e Mini Bar. Os Serviço de Quartos estarão igualmente disponíveis.'
                data='Setembro 14, 2016'
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <MeuCard
                avatar='R'
                imagem='https://www.hoteisangola.com/components/com_reservations/gallery/s1/hotels/large/g7/kakanda%20resort%20dundo-3.jpg'
                titulo='RESTAURANTE & BAR'
                conteudo='O Restaurante do Hotel Diamante Dundo é a opção ideal para todas as suas refeições. Com um ambiente acolhedor, encontrará um serviço personalizado com uma excelente selecção gastronómica. O Bar é o local indicado para uma bebida ou refeição descontraida.'
                data='Setembro 14, 2016'
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <MeuCard
                avatar='L'
                imagem='https://www.hoteisangola.com/components/com_reservations/gallery/s1/hotels/large/g7/kakanda%20resort%20dundo-2.jpg'
                titulo='COMODIDADES E LAZER'
                conteudo='Aproveite para descontrair junto à nossa Piscina, cuide do seu corpo, saúde e mente no nosso Ginásio, tornando a sua estadia mais agradável. Realize reuniões de trabalho e aproveite os serviços de Coffee Break que temos para lhe oferecer.'
                data='Setembro 14, 2016'
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
