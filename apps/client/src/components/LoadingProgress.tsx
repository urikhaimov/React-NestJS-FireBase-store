
import {
    Box,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import { drawerWidth } from '../constants/globalConstants'


const LoadingProgress = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            width={isMobile? `100vw`: `calc(100vw - ${drawerWidth}px)`}
        >
            <CircularProgress />
        </Box>
    )
}

export default LoadingProgress;