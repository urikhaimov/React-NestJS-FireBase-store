import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeftMenu from '../components/LeftMenu';
import { useAuthStore } from '../stores/useAuthStore';

interface Props {
  children: React.ReactNode;
}
const drawerWidth = 240;
export default function Layout({ children }: Props) {
  const { user } = useAuthStore();

  return (
 <Box
  display="flex"
  flexDirection="column"
  height="100vh"
  width="100vw"
  overflow="hidden"
>
  <Header />

  <Box
    display="flex"
    flex="1"
    minHeight={0}
    overflow="hidden"
  >
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'none', sm: 'block' },
      }}
    >
      <LeftMenu />
    </Box>

    <Box
      flex="1"
      overflow="hidden"
      minHeight={0}
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  </Box>

  <Footer />
</Box>


  );
}
