import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeftMenu from '../components/LeftMenu';
import { useAuthStore } from '../stores/useAuthStore'
interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const { user } = useAuthStore(); // get auth state
  return (
    <Box height="100vh" display="flex" flexDirection="column" overflow="hidden" width='100vw'>
      <Header /> {/* sticky top navbar */}
       {user && <LeftMenu />} {/* ✅ show only if logged in */}
      <Box display="flex" flex="1" overflow="hidden">

        <Box flex="1" overflow="hidden" p={3}>
          {children} {/* this includes AdminPageLayout → StickyFiltersWrapper */}
        </Box>
      </Box>
      <Footer />
    </Box>


  );
}
