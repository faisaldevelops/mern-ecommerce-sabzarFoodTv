const contactDetails = {
	whatsapp: "+91-7051896324",
	email: "orders@sabzarfoods.in"
};

const ShippingPolicyPage = () => {
	return (
		<div className='bg-stone-50 min-h-screen text-stone-900'>
			<div className='max-w-4xl mx-auto px-4 py-16 space-y-12'>
				<header className='space-y-3'>
					<p className='text-xs uppercase tracking-[0.2em] text-stone-500'>Customer Care</p>
					<h1 className='text-3xl md:text-4xl font-semibold'>Shipping Policy</h1>
					<p className='text-base text-stone-600'>We pack and ship every order with care so it reaches you fresh and in good condition.</p>
				</header>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Order Processing</h2>
					<ul className='space-y-3 text-sm text-stone-700'>
						<li>Orders are processed within 1–3 business days after confirmation.</li>
						<li>Orders are not shipped or delivered on Sundays or public holidays.</li>
						<li>During high-demand periods (festivals, sales, seasonal rush), processing may take slightly longer.</li>
					</ul>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Shipping & Delivery</h2>
					<ul className='space-y-3 text-sm text-stone-700'>
						<li>We currently ship across India.</li>
						<li>Delivery timelines typically range between 3–7 business days, depending on your location and courier partner.</li>
						<li>Remote or rural areas may require additional delivery time.</li>
					</ul>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Shipping Charges</h2>
					<ul className='space-y-3 text-sm text-stone-700'>
						<li>Shipping charges (if applicable) are calculated and shown at checkout.</li>
						<li>Any free-shipping offers will be clearly mentioned on the website or during checkout.</li>
					</ul>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Packaging</h2>
					<ul className='space-y-3 text-sm text-stone-700'>
						<li>All products are packed securely using food-grade, leak-proof packaging.</li>
						<li>Extra precautions are taken for items like pickles, honey, and other fragile food products to prevent transit damage.</li>
					</ul>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Order Tracking</h2>
					<p className='text-sm text-stone-700'>Once shipped, tracking details will be shared via SMS or WhatsApp (if available) so you can monitor delivery.</p>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Delays & Issues</h2>
					<ul className='space-y-3 text-sm text-stone-700'>
						<li>Sabzar Foods is not responsible for delays caused by courier partners, natural events, strikes, or unforeseen circumstances.</li>
						<li>If your order arrives damaged or tampered, contact us within 24 hours of delivery with photos or videos for assistance.</li>
					</ul>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Returns & Replacements</h2>
					<p className='text-sm text-stone-700'>Due to the perishable nature of food items, we do not accept returns. Replacements or refunds are considered only for damaged, leaked, or incorrect products.</p>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Contact Us</h2>
					<ul className='space-y-2 text-sm text-stone-700'>
						<li><span className='font-medium text-stone-900'>Email:</span> <a className='text-emerald-700 hover:text-emerald-800 underline' href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></li>
						<li><span className='font-medium text-stone-900'>Phone/WhatsApp:</span> <a className='text-emerald-700 hover:text-emerald-800 underline' href='https://wa.me/917051896324' rel='noreferrer' target='_blank'>{contactDetails.whatsapp}</a></li>
					</ul>
				</section>
			</div>
		</div>
	);
};

export default ShippingPolicyPage;
