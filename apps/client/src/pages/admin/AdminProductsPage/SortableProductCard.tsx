import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Product } from '../../../types/firebase';
import ProductAdminCard from './ProductAdminCard';

type Props = {
  product: Product;
  onConfirmDelete: (id: string) => void;
  disabled?: boolean;
};

export default function SortableProductCard({
  product,
  onConfirmDelete,
  disabled = false,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // optional for style feedback
  } = useSortable({ id: product.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'manipulation',
    opacity: isDragging ? 0.5 : 1, // ✨ optional visual cue
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ProductAdminCard
        product={product}
        onConfirmDelete={onConfirmDelete}
        disabled={disabled}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}
