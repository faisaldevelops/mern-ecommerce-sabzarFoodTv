import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicyPage = () => {
	return (
		<div className='min-h-screen bg-stone-50 text-stone-900 py-12 px-4'>
			<div className='max-w-4xl mx-auto'>
				<Link
					to='/'
					className='inline-flex items-center text-stone-600 hover:text-stone-900 mb-6 transition-colors'
				>
					<ArrowLeft size={18} className='mr-2' />
					Back to Home
				</Link>

				<div className='bg-white rounded-lg shadow-sm border border-stone-200 p-8'>
					<h1 className='text-3xl font-bold text-stone-900 mb-2'>PRIVACY NOTICE</h1>
					<h2 className='text-2xl font-semibold text-stone-800 mb-2'>Sabzar Foods Privacy Notice</h2>
					<p className='text-sm text-stone-600 mb-8'>Last Updated: 19th December, 2025</p>

					<div className='prose prose-stone max-w-none space-y-6'>
						<section>
							<p className='text-stone-700 leading-relaxed mb-4'>
								Sabzar Foods ("we" or "us") is committed to protecting your privacy, as detailed in this Privacy Notice, which governs your use of our website (www.sabzarfoods.in) and social media pages (the "Site"). This Notice is subject to our Terms of Use and covers information collected only through the Site, excluding offline or third-party data.
							</p>
							<p className='text-stone-700 leading-relaxed font-medium'>
								By using the Site, you agree to these privacy practices.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>1. Information Collection</h2>
							<p className='text-stone-700 leading-relaxed mb-3'>
								We collect Personal Information (like name, email, financial info, IP address) and non-identifying data in three ways:
							</p>
							<div className='space-y-3'>
								<p className='text-stone-700 leading-relaxed'>
									<strong className='text-stone-900'>Information you provide:</strong> Through forms, account registration, surveys, purchases, or when contacting us. Financial information is handled by our Payment Processors (PayPal/Razorpay), subject to their terms. Content you submit (comments, reviews) may be retained indefinitely.
								</p>
								<p className='text-stone-700 leading-relaxed'>
									<strong className='text-stone-900'>Information we automatically collect:</strong> Upon visiting the Site, we automatically record data like IP address, browser type, pages viewed, and usage dates.
								</p>
								<p className='text-stone-700 leading-relaxed'>
									<strong className='text-stone-900'>Cookies/Analytics:</strong> We use cookies to analyze web flow, customize content, and improve safety. You can decline cookies, but it may affect Site functionality. We may use Google Analytics, and you can opt-out via the provided links.
								</p>
							</div>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>2. How we use information</h2>
							<p className='text-stone-700 leading-relaxed'>
								We use your information to fulfill your requests, provide services, personalize content, analyze usage trends, improve the Site, detect fraud, ensure security, and contact you for administrative or promotional purposes. You can generally opt-out of promotional emails.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>3. When we disclose information</h2>
							<p className='text-stone-700 leading-relaxed mb-3'>
								We may disclose aggregated, non-identifying information freely. Personal Information may be disclosed:
							</p>
							<ul className='list-disc list-inside text-stone-700 space-y-1 ml-4'>
								<li>To third parties for business/marketing (preferably aggregated/de-identified).</li>
								<li>To service providers for functions like hosting, payment processing, and maintenance.</li>
								<li>If required by law, court order, or to protect our rights, security, or to assist with fraud prevention.</li>
								<li>To a successor in case of a merger, sale, or bankruptcy.</li>
								<li>As described to you at collection, to fulfill the purpose, or with your consent.</li>
							</ul>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>4. Your Choices</h2>
							<p className='text-stone-700 leading-relaxed'>
								You can decline to share certain information (which may limit features), update/correct your account preferences, and opt-out of most promotional emails (using the unsubscribe link or by contacting us).
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>5. Children's Privacy</h2>
							<p className='text-stone-700 leading-relaxed'>
								The Site is not for children under 13. We do not knowingly collect information from those under 13. Parents/guardians should contact us if a child has provided information.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>6. Data Security</h2>
							<p className='text-stone-700 leading-relaxed'>
								We implement safeguards, but no security system is perfect. You transmit information at your own risk. We are not responsible for security circumvention.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>7. Visitors from Outside India</h2>
							<p className='text-stone-700 leading-relaxed'>
								The Site is controlled in India. By accessing it from outside India, you consent to your data being transferred, stored, and processed in India. Residents of some jurisdictions may have rights to access, correct, or delete their Personal Information; contact us at <a href='mailto:orders@sabzarfoods.in' className='text-stone-800 underline hover:text-stone-900'>orders@sabzarfoods.in</a> for inquiries.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>8. Limitation of Liability</h2>
							<p className='text-stone-700 leading-relaxed'>
								By using the Site, you release us from liability for any loss or damage arising from the use or misuse of your information, including misuse by our service providers.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>9. Changes to this Notice</h2>
							<p className='text-stone-700 leading-relaxed'>
								We may change this Notice and will notify you of significant changes via the Site or email. Please review this page periodically.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>10. Do Not Track</h2>
							<p className='text-stone-700 leading-relaxed'>
								Due to a lack of standards, the Site does not currently respond to "Do Not Track" browser settings.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>11. Contact Information</h2>
							<p className='text-stone-700 leading-relaxed'>
								For questions, email <a href='mailto:orders@sabzarfoods.in' className='text-stone-800 underline hover:text-stone-900'>orders@sabzarfoods.in</a> or write to Sabzar Foods, Attn: Privacy, Main Chowk, Kupwara, Dist Kupwara, Jammu and Kashmir, India 193222.
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPolicyPage;

