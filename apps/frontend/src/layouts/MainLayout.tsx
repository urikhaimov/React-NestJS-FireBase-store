// src/layouts/Layout.tsx
import { Box } from '@mui/material';
import Header from '../components/Header/Header';
import Footer from '../components/Footer';
import LeftMenu from '../components/LeftMenu/LeftMenu';
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

      <Box display="flex" flex="1" minHeight={0} overflow="hidden">
        <LeftMenu />

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
