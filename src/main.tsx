import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {CssBaseline, StyledEngineProvider} from '@mui/material';
import {ThemeProvider} from '@emotion/react';

import {App} from '@/components/App';

import {LoadingProvider} from '@/state/Loading';
import {TransactionsProvider} from '@/state/Transactions';

import {theme} from '@/styles/theme';

import './main.css';
import {MessagesProvider} from "@/state/Messages";
import {TableResponseProvider} from "@/state/TableResponse";

createRoot(document.getElementById('root') as HTMLElement).render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme/>
            <LoadingProvider>
                <MessagesProvider>
                    <TransactionsProvider>
                        <TableResponseProvider>
                            <StrictMode>
                                <App/>
                            </StrictMode>
                        </TableResponseProvider>
                    </TransactionsProvider>
                </MessagesProvider>
            </LoadingProvider>
        </ThemeProvider>
    </StyledEngineProvider>
);
