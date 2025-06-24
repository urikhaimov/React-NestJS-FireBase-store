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
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRedirect } from '../../context/RedirectContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, setUser, user } = useAuthStore();
  const { redirectTo, setRedirectTo, message, setMessage } = useRedirect();
  const navigate = useNavigate();
  const location = useLocation();

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

  // ✅ Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // 🔍 Ensure role exists in Firestore
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
      flexGrow={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      py={4}
      sx={{
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Welcome back
        </Typography>

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
              sx={{ py: 1.5, fontWeight: 600, fontSize: '1rem' }}
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
      </Paper>
    </Box>
  );
};

export default LoginPage;
