import {Alert, Box, Container, Grid} from '@mui/material';
import {Header} from '@/components/Header';
import {ButtonBox} from '@/components/ButtonBox';
import {TxnGrid} from '@/components/TxnGrid';
import {ChatBox} from '@/components/ChatBox';
import styles from './App.module.css';
import {Md5} from 'ts-md5'

export function App() {

    if(localStorage.getItem('token') && Md5.hashStr(localStorage.getItem('token')) == `${import.meta.env.VITE_TOKEN}`) {
        return (
            <>
                <Header/>
                <ButtonBox/>
                <main className={styles.container}>
                    <Grid container spacing={0} className={styles.containerGrid}>
                        <Grid item xs={3} className={styles.leftContainer}>
                            <ChatBox/>
                        </Grid>
                        <Grid item xs={9} className={styles.rightContainer}>
                            <TxnGrid/>
                        </Grid>
                    </Grid>


                </main>
            </>
        );
    }
    else {
        return (
            <Box sx={{ flexGrow: 1, margin: 3 }}>
                <Container fixed>
                    <Alert severity="error">User not authorized!</Alert>
                </Container>
            </Box>

        );
    }
}
