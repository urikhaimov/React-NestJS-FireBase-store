import React, { useEffect, useReducer, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';

import AdminStickyPage from '../../../layouts/AdminStickyPage';
import PageHeader from '../../../layouts/PageHeader';

import ImageUploader from '../../../components/ImageUploader';
import SectionsEditor from '../../../components/SectionsEditor';
import FormTextField from '../../../components/FormTextField';

import { reducer, initialState } from './LocalReducer';

import { useLandingPage, useUpdateLandingPage } from '../../../hooks/useLandingPage';
import type { LandingPageData } from '../../../types/landing';

import { uploadImage, deleteImage, deleteImageByUrl } from '../../../utils/storageHelpers';

export default function AdminLandingPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const uploadedPathsRef = useRef<string[]>([]);

  const { data, isLoading, error } = useLandingPage();
  const updateMutation = useUpdateLandingPage();

  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_FORM', payload: data });

      if (data.bannerImageUrl) {
        dispatch({
          type: 'SET_IMAGE_STATE',
          payload: [
            {
              id: 'existing-banner',
              url: data.bannerImageUrl,
              type: 'existing',
            },
          ],
        });
      }
    }
  }, [data]);

  useEffect(() => {
    return () => {
      uploadedPathsRef.current.forEach(async (path) => {
        try {
          await deleteImage(path);
        } catch (err) {
          console.warn('Failed to delete abandoned image:', err);
        }
      });
    };
  }, []);

  const handleChange =
    (field: keyof LandingPageData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'SET_FORM', payload: { [field]: e.target.value } });
    };

  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    dispatch({
      type: 'SET_IMAGE_STATE',
      payload: [
        {
          id: `new-${Date.now()}`,
          url: blobUrl,
          type: 'new',
          file,
          progress: 0,
        },
      ],
    });
  };

  const handleRemove = () => {
    dispatch({ type: 'SET_IMAGE_STATE', payload: [] });
  };

  const handleSave = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    let finalBannerUrl = '';
    const newImage = state.images.find((img) => img.type === 'new' && img.file);
    const existingImage = state.images.find((img) => img.type === 'existing');

    if (newImage && existingImage?.url) {
      try {
        await deleteImageByUrl(existingImage.url);
      } catch (error) {
        console.warn('Could not delete previous image:', error);
      }
    }

    if (newImage?.file) {
      try {
        finalBannerUrl = await uploadImage(newImage.file, `landing/banner-${Date.now()}`);
        uploadedPathsRef.current.push(finalBannerUrl);
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: 'Image upload failed. Please try again.' });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
    }

    if (!newImage && existingImage) {
      finalBannerUrl = existingImage.url;
    }

    if (state.images.length === 0) {
      finalBannerUrl = '';
    }

    const saveData: LandingPageData = {
      ...state.form,
      bannerImageUrl: finalBannerUrl,
      sections: state.form.sections || [],
    };

    try {
      await updateMutation.mutateAsync(saveData);
      dispatch({ type: 'SET_SUCCESS', payload: 'Landing page updated successfully!' });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save landing page. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      uploadedPathsRef.current = [];
    }
  };

  if (isLoading) return <div>Loading landing page data...</div>;
  if (error) return <div>Error loading landing page data</div>;

  return (
    <AdminStickyPage title="Landing Page">
      <PageHeader
        title="Landing Page"
        description="Customize your store's homepage layout, banners, and sections"
      />

      <Box
        mt={2}
        sx={{
          maxHeight: 'calc(100vh - 400px)',
          overflowY: 'auto',
          pr: 1,
        }}
      >
        <Paper sx={{ p: 2, minHeight: 600 }}>
          <Stack spacing={2}>
            <FormTextField
              label="Title"
              value={state.form.title || ''}
              onChange={handleChange('title')}
            />
            <FormTextField
              label="Subtitle"
              value={state.form.subtitle || ''}
              onChange={handleChange('subtitle')}
            />

            <ImageUploader
              images={state.images}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onReorderAll={() => {}}
              errorMessage={state.errorMessage}
              showSnackbar={state.showSnackbar}
              onCloseSnackbar={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
            />

            <FormTextField
              label="CTA Button Text"
              value={state.form.ctaButtonText || ''}
              onChange={handleChange('ctaButtonText')}
            />
            <FormTextField
              label="CTA Button Link"
              value={state.form.ctaButtonLink || ''}
              onChange={handleChange('ctaButtonLink')}
            />

            <SectionsEditor
              sections={state.form.sections || []}
              onChange={(updated) => dispatch({ type: 'SET_SECTIONS', payload: updated })}
            />

            <Box textAlign="right">
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={state.loading || updateMutation.status === 'pending'}
              >
                Save Changes
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Snackbar
        open={state.showSnackbar}
        autoHideDuration={4000}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
      >
        <Alert
          onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
          severity={state.errorMessage ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {state.errorMessage || state.successMessage}
        </Alert>
      </Snackbar>
    </AdminStickyPage>
  );
}
