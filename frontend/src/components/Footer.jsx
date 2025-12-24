import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className='bg-stone-100 border-t border-stone-200 mt-auto'>
			<div className='container mx-auto px-4 py-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					{/* Policies Section */}
					<div>
						<h3 className='text-base font-semibold text-stone-900 mb-3'>Policies</h3>
						<ul className='space-y-2'>
							<li>
								<Link to='/refund-return-policy' className='text-sm text-stone-600 hover:text-stone-900 transition-colors'>
									Refund & Return Policy
								</Link>
							</li>
							<li>
								<Link to='/shipping-policy' className='text-sm text-stone-600 hover:text-stone-900 transition-colors'>
									Shipping Policy
								</Link>
							</li>
							<li>
								<Link to='/privacy-policy' className='text-sm text-stone-600 hover:text-stone-900 transition-colors'>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link to='/terms-of-service' className='text-sm text-stone-600 hover:text-stone-900 transition-colors'>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Section */}
					<div>
						<h3 className='text-base font-semibold text-stone-900 mb-3'>Contact Us</h3>
						<ul className='space-y-2'>
							<li>
								<a href='http://wa.me/917051896324' target='_blank' rel='noopener noreferrer' className='text-sm text-stone-600 hover:text-stone-900 transition-colors inline-flex items-center'>
									WhatsApp: +91-7051896324
								</a>
							</li>
							<li>
								<a href='mailto:orders@sabzarfoods.in' className='text-sm text-stone-600 hover:text-stone-900 transition-colors'>
									Email: orders@sabzarfoods.in
								</a>
							</li>
							<li className='text-sm text-stone-600'>
								Address: Main Chowk, Kupwara, Dist Kupwara, J&K, India. 193222
							</li>
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className='border-t border-stone-200 mt-8 pt-6'>
					<p className='text-sm text-stone-600 text-center'>
						© {new Date().getFullYear()} Sabzar Foods. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
