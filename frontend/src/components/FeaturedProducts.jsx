import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();
	const handleAddToCart = (product) => {
		addToCart(product);
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className='py-16'>
			<div className='container mx-auto px-4'>
				<h2 className='text-3xl sm:text-4xl font-semibold text-white mb-8 tracking-tight'>Featured Products</h2>
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-500 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{featuredProducts?.map((product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
									<div className='border border-neutral-800 bg-black overflow-hidden h-full transition-colors hover:border-neutral-600'>
										<div className='overflow-hidden'>
											<img
												src={product.image}
												alt={product.name}
												className='w-full h-48 object-cover transition-transform duration-700 ease-out hover:scale-105'
											/>
										</div>
										<div className='p-4'>
											<h3 className='text-sm font-medium mb-2 text-white'>{product.name}</h3>
											<p className='text-white font-semibold mb-4'>
												${product.price.toFixed(2)}
											</p>
											<button
												onClick={() => handleAddToCart(product)}
												className='w-full bg-white text-black font-medium py-2 px-4 text-xs tracking-wide uppercase transition-colors hover:bg-neutral-200'
											>
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 transition-colors ${
							isStartDisabled ? "bg-neutral-800 cursor-not-allowed text-neutral-600" : "bg-white text-black hover:bg-neutral-200"
						}`}
					>
						<ChevronLeft className='w-5 h-5' />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 transition-colors ${
							isEndDisabled ? "bg-neutral-800 cursor-not-allowed text-neutral-600" : "bg-white text-black hover:bg-neutral-200"
						}`}
					>
						<ChevronRight className='w-5 h-5' />
					</button>
				</div>
			</div>
		</div>
	);
};
export default FeaturedProducts;
