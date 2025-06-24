
import {
    Box,
    CircularProgress,
} from '@mui/material';

import {drawerWidth}  from '../constants/globalConstants'


const LoadingProgress = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            width={`calc(100vw - ${drawerWidth}px)` }
        >
            <CircularProgress />
        </Box>
    )
}

export default LoadingProgress;