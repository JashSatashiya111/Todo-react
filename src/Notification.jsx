import { Alert, Snackbar } from '@mui/material'
import React, { useState } from 'react'

const Notification = ({ message, close, severity }) => {
    const [open, setopen] = useState(true);
    const handleClose = () => {
        close(null)
        setopen(false)
    }
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} >
                {message}
            </Alert>
        </Snackbar >
    )
}

export default Notification