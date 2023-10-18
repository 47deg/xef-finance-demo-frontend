import {Grid} from '@mui/material';
import {Header} from '@/components/Header';
import {ButtonBox} from '@/components/ButtonBox';
import {TxnGrid} from '@/components/TxnGrid';
import {ChatBox} from '@/components/ChatBox';
import styles from './App.module.css';

export function App() {

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
