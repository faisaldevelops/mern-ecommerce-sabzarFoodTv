import { ShoppingCart, AlertCircle } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
	const { addToCart } = useCartStore();
	const isOutOfStock = !product.stockQuantity || product.stockQuantity === 0;
	const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10;
	
	const handleAddToCart = () => {
		if (isOutOfStock) {
			toast.error("This item is currently out of stock");
			return;
		}
		addToCart(product);
	};

	return (
		<div className='group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:border-emerald-500/30'>
			{/* Image Container */}
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img 
					className='object-cover w-full transition-transform duration-300 group-hover:scale-105' 
					src={product.image} 
					alt={product.name} 
				/>
				
				{/* Overlay for out of stock */}
				{isOutOfStock && (
					<div className='absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center'>
						<div className='text-center'>
							<AlertCircle className='h-12 w-12 text-red-400 mx-auto mb-2' />
							<span className='text-white text-lg font-bold'>
								Out of Stock
							</span>
						</div>
					</div>
				)}
				
				{/* Low stock badge */}
				{isLowStock && (
					<div className='absolute top-2 right-2'>
						<span className='bg-yellow-500/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full'>
							Only {product.stockQuantity} left
						</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className='mt-4 px-5 pb-5 flex flex-col flex-grow'>
				<h5 className='text-lg font-semibold tracking-tight text-white line-clamp-2 mb-2'>
					{product.name}
				</h5>
				
				<div className='mt-auto'>
					<div className='flex items-baseline justify-between mb-3'>
						<span className='text-3xl font-bold text-emerald-400'>
							${product.price}
						</span>
					</div>
					
					<button
						className={`w-full flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold
							transition-all duration-200 transform active:scale-95 ${
							isOutOfStock
								? 'bg-gray-700 text-gray-400 cursor-not-allowed'
								: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40'
						}`}
						onClick={handleAddToCart}
						disabled={isOutOfStock}
					>
						<ShoppingCart size={18} />
						{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
					</button>
				</div>
			</div>
		</div>
	);
};
export default ProductCard;
