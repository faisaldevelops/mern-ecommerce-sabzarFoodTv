const LoadingSpinner = () => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-black'>
			<div className='relative'>
				<div className='w-16 h-16 border-neutral-800 border-2' />
				<div className='w-16 h-16 border-white border-t-2 animate-spin absolute left-0 top-0' />
				<div className='sr-only'>Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
