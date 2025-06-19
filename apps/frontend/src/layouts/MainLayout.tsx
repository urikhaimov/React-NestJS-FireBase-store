import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeftMenu from '../components/LeftMenu';
import { useAuthStore } from '../stores/useAuthStore';

interface Props {
  children: React.ReactNode;
}

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

      <Box display="flex" flex="1" overflow="hidden" minHeight={0}>
        {user && <LeftMenu />}

        <Box
          flex="1"
          overflow="auto"
          sx={{
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
          }}
        >
          {children}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
