import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useSafeAuth } from '../../hooks/getSafeAuth';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

export default function SignupPage() {
  const { register, handleSubmit, reset } = useForm();
  const { signup } = useSafeAuth();
  const navigate = useNavigate();
const onSubmit = async (data: any) => {
    try {
      await signup(data.email, data.password);
      alert('Signup successful!');
      reset(); // clear form
      navigate('/'); // navigate home or to dashboard
    } catch (err: any) {
      console.error('Signup error:', err); // log full error
      alert('Signup failed: ' + (err?.message || 'Unknown error'));
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
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register('email', { required: true })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: true })}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Create Account
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
