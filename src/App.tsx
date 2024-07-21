import { Routes } from '@/routes';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@/services';
import { SnackbarProvider } from './components/snackbar/Snackbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme } from './theme';

function App() {
  return (
    <>
      <QueryClientProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
              <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Routes />
              </Box>
            </LocalizationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
