import { Box, Typography, Grid } from '@mui/material'

// import logo from '@/assets/CapitalOneLogo.png';
import * as myIcons from '@mui/icons-material'
import { useContext } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import CSS from 'csstype'

import { LoadingContext } from '@/state/Loading'

import { getTheme } from '@/utils/constants.ts'

import fakeAuth from '@/assets/fakeUser.png'
import logo from '@/assets/logo_bank_ireland.png'

import styles from './Header.module.css'

export function Header() {
  const [loading, _] = useContext(LoadingContext)

  const logoStyles: CSS.Properties = {
    backgroundImage: `url(${getTheme().logofilename})`,
  }

  return (
    <Box component="header" className={styles.header}>
      <div className={styles.logo} style={logoStyles}></div>
      <div className={styles.titleContainer}>
        <Typography variant="h4" className={styles.title}>
          Personal Finance Manager
        </Typography>
      </div>
      <div className={styles.loading}>
        {loading && (
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Grid item>Loading</Grid>
            <Grid item>
              <CircularProgress size={20} color="inherit" thickness={8} />
            </Grid>
          </Grid>
        )}
      </div>
      <div>
        <img className={styles.user} src={fakeAuth} alt="User" />
      </div>
    </Box>
  )
}
