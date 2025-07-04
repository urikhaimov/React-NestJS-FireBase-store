// MyOrdersScrollContainer.tsx
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const MyOrdersScrollContainer = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 240px)',
  paddingRight: theme.spacing(1),
  scrollbarWidth: 'thin',
  scrollbarColor: '#888 #2c2c2c',

  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#2c2c2c',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: '8px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#aaa',
  },
}));

export default MyOrdersScrollContainer;
