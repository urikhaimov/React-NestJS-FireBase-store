import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Paper, Stack
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRedirect } from '../../context/RedirectContext';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, user, loading } = useAuthStore();
  const { redirectTo, setRedirectTo, message, setMessage } = useRedirect();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(user, 'user in LoginPage');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  // 🔁 Wait for user to be set after login
  useEffect(() => {
    if (user) {
      const target = redirectTo || location.state?.from?.pathname ||
        ['admin', 'superadmin'].includes(user.role) ? '/admin' : '/';
      navigate(target, { replace: true });
      setRedirectTo(null);
    }
  }, [user, redirectTo, location.state, navigate, setRedirectTo]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password); // ✅ will trigger the `user` change above
    } catch (err) {
      setMessage('Invalid email or password');
    }
  };

  return (
    <Box
      flexGrow={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      py={4}
      sx={{
        width: '100%', // Safe
        maxWidth: '100vw', // Prevent overflow
        overflowX: 'hidden', // Enforced here too
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Welcome Back
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              fullWidth
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{ py: 1.5, fontWeight: 600, fontSize: '1rem' }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
