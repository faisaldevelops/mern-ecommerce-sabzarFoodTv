import React from "react";

const contactDetails = {
	whatsappLink: "https://wa.me/917051896324",
	whatsappLabel: "Chat on WhatsApp",
	email: "orders@sabzarfoods.in",
	postal: "Sabzar Foods, Main Chowk, Kupwara Dist Kupwara, J&K, India. 193222"
};

const PrivacyPolicyPage = () => {
	return (
		<div className='bg-stone-50 min-h-screen text-stone-900'>
			<div className='max-w-4xl mx-auto px-4 py-16 space-y-12'>
				<header className='space-y-3'>
					<p className='text-xs uppercase tracking-[0.2em] text-stone-500'>Customer Care</p>
					<h1 className='text-3xl md:text-4xl font-semibold'>Privacy Policy</h1>
					<p className='text-base text-stone-600'>
						We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard data when you visit or purchase from our website.
					</p>
				</header>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Who We Are</h2>
					<p className='text-sm text-stone-700'>Registered business address: {contactDetails.postal}</p>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Information We Collect</h2>
					<ul className='space-y-3 text-sm text-stone-700'>
						<li>Contact details such as name, phone number, email, and delivery address.</li>
						<li>Order and payment details necessary to process your purchase (payments are handled by trusted payment partners).</li>
						<li>Usage data like device, browser, and interaction information to improve our site and prevent fraud.</li>
					</ul>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>How We Use Your Information</h2>
					<ul className='space-y-3 text-sm text-stone-700'>
						<li>To process orders, payments, deliveries, and customer support requests.</li>
						<li>To send order updates, transactional alerts, and important service notices.</li>
						<li>To improve our products, website experience, and protect against fraud or misuse.</li>
					</ul>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Sharing Your Information</h2>
					<ul className='space-y-3 text-sm text-stone-700'>
						<li>With service providers (logistics, payments, analytics) strictly to fulfill orders and improve services.</li>
						<li>With authorities if required to comply with law, enforce policies, or protect rights and safety.</li>
					</ul>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Data Security</h2>
					<p className='text-sm text-stone-700'>We use reasonable technical and organizational measures to safeguard your data. No method of transmission or storage is fully secure, so we cannot guarantee absolute security.</p>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Cookies and Tracking</h2>
					<p className='text-sm text-stone-700'>We may use cookies and similar technologies to enable core functionality, remember preferences, and understand site usage. You can manage cookies through your browser settings.</p>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Your Choices</h2>
					<ul className='space-y-3 text-sm text-stone-700'>
						<li>You may update your account or contact details by reaching out to us.</li>
						<li>You may opt out of non-essential communications by using provided unsubscribe options.</li>
					</ul>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Data Retention</h2>
					<p className='text-sm text-stone-700'>We retain personal information only as long as necessary to fulfill the purposes described above, comply with legal obligations, and resolve disputes.</p>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold'>Contact Us</h2>
					<ul className='space-y-2 text-sm text-stone-700'>
						<li><span className='font-medium text-stone-900'>Email:</span> <a className='text-emerald-700 hover:text-emerald-800 underline' href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></li>
						<li><span className='font-medium text-stone-900'>Phone/WhatsApp:</span> <a className='text-emerald-700 hover:text-emerald-800 underline' href={contactDetails.whatsappLink} rel='noreferrer' target='_blank'>{contactDetails.whatsappLabel}</a></li>
						<li><span className='font-medium text-stone-900'>Address:</span> {contactDetails.postal}</li>
					</ul>
				</section>
			</div>
		</div>
	);
};

export default PrivacyPolicyPage;
