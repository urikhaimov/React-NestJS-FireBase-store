import {
  Box,
  Button,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useReducer, useRef } from 'react';
import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import { db, storage } from '../../../firebase';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
import PageHeader from '../../../layouts/PageHeader';

import ImageUploader from '../../../components/ImageUploader';
import SectionsEditor from '../../../components/SectionsEditor';
import FormTextField from '../../../components/FormTextField';

import { reducer, initialState } from './LocalReducer';
import type { CombinedImage } from '../../../components/ImageUploader';
import type { LandingPageData } from '../../../types/landing';

export default function AdminLandingPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const uploadedPathsRef = useRef<string[]>([]);

  // 🔄 Load landing page data on mount
  useEffect(() => {
    const fetchData = async () => {
      const refDoc = doc(db, 'landingPages', 'default');
      const snap = await getDoc(refDoc);

      if (snap.exists()) {
        const data = snap.data() as LandingPageData;
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
    };
    fetchData();
  }, []);

  // 🧹 Cleanup abandoned images on unmount
  useEffect(() => {
    return () => {
      uploadedPathsRef.current.forEach(async (path) => {
        try {
          await deleteObject(ref(storage, path));
          console.log('Deleted abandoned image:', path);
        } catch (err) {
          console.warn('Failed to delete abandoned image:', err);
        }
      });
    };
  }, []);

  // 🔧 Handle text input change
  const handleChange =
    (field: keyof LandingPageData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_FORM', payload: { [field]: e.target.value } });
      };

  // 📥 Handle image drop
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

  // 🗑️ Handle image removal
  const handleRemove = () => {
    dispatch({ type: 'SET_IMAGE_STATE', payload: [] });
  };

  // 💾 Save form and image to Firestore
  const handleSave = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const newImage = state.images.find((img) => img.type === 'new' && img.file);
    const existingImage = state.images.find((img) => img.type === 'existing');
    let finalBannerUrl = '';

    // Delete previous image if replaced
    if (newImage && existingImage?.url) {
      try {
        const path = decodeURIComponent(new URL(existingImage.url).pathname.split('/o/')[1].split('?')[0]);
        await deleteObject(ref(storage, path));
      } catch (error) {
        console.warn('Could not delete previous image:', error);
      }
    }

    // Upload new image if exists
    if (newImage?.file) {
      try {
        const fileRef = ref(storage, `landing/banner-${Date.now()}`);
        const uploadTask = await uploadBytes(fileRef, newImage.file);
        finalBannerUrl = await getDownloadURL(uploadTask.ref);
        uploadedPathsRef.current.push(uploadTask.ref.fullPath);
      } catch (err) {
        console.error('Upload failed', err);
        dispatch({ type: 'SET_ERROR', payload: 'Image upload failed. Please try again.' });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
    }

    // Fallback to existing image if new not uploaded
    if (!newImage && existingImage) {
      finalBannerUrl = existingImage.url;
    }

    // Clear banner if all images are removed
    if (state.images.length === 0) {
      finalBannerUrl = '';
    }

    // Update Firestore document
    await updateDoc(doc(db, 'landingPages', 'default'), {
      ...state.form,
      bannerImageUrl: finalBannerUrl,
      sections: state.form.sections || [],
    });

    uploadedPathsRef.current = [];
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  return (
    <AdminStickyPage title="Landing Page">
      <PageHeader
        title="Landing Page"
        description="Customize your store's homepage layout, banners, and sections"
      />

      <Box
        mt={2}
        sx={{
          maxHeight: 'calc(100vh - 360px)', // adjust based on your sticky header/footer height
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
              onReorderAll={() => { }}
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
                disabled={state.loading}
              >
                Save Changes
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Snackbar
        open={state.showSnackbar}
        autoHideDuration={5000}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
      >
        <Alert severity="error" onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}>
          {state.errorMessage}
        </Alert>
      </Snackbar>
    </AdminStickyPage>

  );
}
