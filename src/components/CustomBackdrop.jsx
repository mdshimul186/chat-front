import React from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

function CustomBackdrop({backdrop}) {
    return (
        <Backdrop style={{zIndex:"99999"}} open={backdrop}>
        <CircularProgress color="primary" />
      </Backdrop>
    )
}

export default CustomBackdrop
