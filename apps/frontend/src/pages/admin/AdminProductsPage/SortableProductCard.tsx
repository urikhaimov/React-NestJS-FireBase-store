import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Product } from '../../../types/firebase'
import ProductAdminCard from './ProductAdminCard';

type Props = {
  product: Product;
  onConfirmDelete: (id: string) => void;
};

export default function SortableProductCard({ product, onConfirmDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'manipulation',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProductAdminCard product={product} onConfirmDelete={onConfirmDelete} />
    </div>
  );
}
