// src/components/ReorderComponent.tsx
import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  LinearProgress,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { motion } from 'framer-motion';
import type { CombinedImage } from './ImageUploader';

interface Props {
  images: CombinedImage[];
  onReorder: (newOrder: CombinedImage[]) => void;
  onRemove: (id: string) => void;
}

export default function ReorderComponent({ images, onReorder, onRemove }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          justifyContent={isMobile ? 'center' : 'flex-start'}
          sx={{ position: 'relative' }}
        >
          {images.map((img) => (
            <SortableImage key={img.id} image={img} onRemove={() => onRemove(img.id)} />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}

function SortableImage({ image, onRemove }: { image: CombinedImage; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'manipulation' as const,
    zIndex: isDragging ? 1300 : 'auto',
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout // ✨ Animate layout changes!
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      {...attributes}
      {...listeners}
    >
      <Card
        sx={{
          width: { xs: 90, sm: 100 },
          height: { xs: 90, sm: 100 },
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: isDragging ? 4 : 2,
        }}
      >
        <CardMedia
          component="img"
          image={image.url}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {image.type === 'new' && image.progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={image.progress}
            sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4 }}
          />
        )}

        <Tooltip title="Drag to reorder" arrow>
          <DragIndicatorIcon
            fontSize="small"
            sx={{
              position: 'absolute',
              bottom: 4,
              left: 4,
              color: 'rgba(255,255,255,0.8)',
              bgcolor: 'rgba(0,0,0,0.4)',
              borderRadius: '50%',
              p: 0.5,
            }}
          />
        </Tooltip>

        <IconButton
          onClick={onRemove}
          size="small"
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,1)',
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Card>
    </motion.div>
  );
}
