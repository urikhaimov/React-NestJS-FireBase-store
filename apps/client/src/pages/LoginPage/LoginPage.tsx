// src/pages/LoginPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  IconButton,
  InputAdornment,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRedirect } from '../../context/RedirectContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, setUser, user } = useAuthStore();
  const { redirectTo, setRedirectTo, message, setMessage } = useRedirect();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  useEffect(() => {
    if (user) {
      const target =
        redirectTo ||
        location.state?.from?.pathname ||
        (['admin', 'superadmin'].includes(user.role ?? '') ? '/admin' : '/');
      navigate(target, { replace: true });
      setRedirectTo(null);
    }
  }, [user, redirectTo, location.state, navigate, setRedirectTo]);

  useEffect(() => {
    return () => setMessage(null);
  }, [setMessage]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      setMessage('Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: 'user',
        });
      }

      const role = (userSnap.data()?.role ?? 'user') as 'user' | 'admin' | 'superadmin';

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: firebaseUser.displayName ?? '',
        role,
      });
    } catch (err) {
      setMessage('Google login failed');
      console.error(err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="100vw"
      px={2}
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Paper
          elevation={6}
          sx={{
            p: isMobile ? 3 : 5,
            width: isMobile ? 320 : 400,
            borderRadius: 3,
          }}
        >
          {/* ✅ Logo or brand */}
          <Box textAlign="center" mb={2}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              My Online Store
            </Typography>
            <Typography variant="h6">Welcome back</Typography>
          </Box>

          {message && (
            <Typography variant="body2" color="error" textAlign="center" mb={2}>
              {message}
            </Typography>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                fullWidth
                inputRef={emailRef}
                autoFocus
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </Button>

              <Typography
                component={RouterLink}
                to="/reset-password"
                variant="body2"
                color="primary"
                textAlign="right"
                sx={{ textDecoration: 'none', mt: -1 }}
              >
                Forgot password?
              </Typography>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }}>or</Divider>

          <Button
            onClick={handleGoogleLogin}
            variant="outlined"
            fullWidth
            startIcon={<Google />}
          >
            Sign in with Google
          </Button>

          {/* ✅ Animated sign-up CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Box mt={3} textAlign="center">
              <Typography variant="body2" gutterBottom>
                Don’t have an account?
              </Typography>
              <Button
                component={RouterLink}
                to="/signup"
                variant="outlined"
                color="primary"
                size="small"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Create an account
              </Button>
            </Box>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
