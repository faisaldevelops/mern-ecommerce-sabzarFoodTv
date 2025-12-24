import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfServicePage = () => {
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
					<h1 className='text-3xl font-bold text-stone-900 mb-2'>Terms of Service</h1>
					<p className='text-sm text-stone-600 mb-8'>Last updated: 19th December 2025</p>

					<div className='prose prose-stone max-w-none space-y-6'>
						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>OVERVIEW</h2>
							<p className='text-stone-700 leading-relaxed mb-4'>
								This website is operated by Sabzar Foods ("we," "us," "our"). By using this site, visiting, or purchasing from us, you agree to these Terms of Service ("Terms") and all referenced policies. These Terms apply to all site users.
							</p>
							<p className='text-stone-700 leading-relaxed mb-4'>
								Please read these Terms carefully. By accessing or using the site, you agree to them. If you disagree, do not access the site or use the services. We may update these Terms by posting changes, and your continued use means you accept those changes. Our store is hosted on Shopify Inc.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 1 - ONLINE STORE TERMS</h2>
							<p className='text-stone-700 leading-relaxed'>
								By agreeing, you confirm you are the age of majority in your jurisdiction or have given consent for your minor dependents to use this site. You must not use our products for illegal purposes or violate any laws. Breach of these Terms will result in immediate termination of Services.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 2 - GENERAL CONDITIONS</h2>
							<p className='text-stone-700 leading-relaxed'>
								We reserve the right to refuse service. Your content (excluding credit card information) may be transferred unencrypted. Credit card information is always encrypted. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any part of the Service without our express written permission. Headings are for convenience only.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h2>
							<p className='text-stone-700 leading-relaxed'>
								We are not responsible if site information is inaccurate, incomplete, or not current. Site material is for general information only; rely on it at your own risk. This site may contain historical information, which is not current. We may modify site contents but are not obligated to update information. You are responsible for monitoring changes.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES</h2>
							<p className='text-stone-700 leading-relaxed'>
								Product prices are subject to change without notice. We can modify or discontinue the Service at any time without notice and are not liable to you or any third-party for such actions.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 5 - PRODUCTS OR SERVICES (if applicable)</h2>
							<p className='text-stone-700 leading-relaxed'>
								Certain products or services may be exclusively available online, have limited quantities, and are subject to our Return Policy. We try to display product colors and images accurately but cannot guarantee your monitor's display. We reserve the right to limit sales, quantities, and discontinue any product or service at our sole discretion. We do not warrant that product quality or service errors will be corrected.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION</h2>
							<p className='text-stone-700 leading-relaxed'>
								We reserve the right to refuse or cancel any order, including limiting quantities. We may attempt to notify you of changes or cancellations. We reserve the right to prohibit orders appearing to be placed by dealers/resellers. You agree to provide current, complete, and accurate purchase and account information and to promptly update it. Review our Returns Policy for more details.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 7 - OPTIONAL TOOLS</h2>
							<p className='text-stone-700 leading-relaxed'>
								We may provide access to third-party tools "as is" and "as available" without warranties or liability. Your use of these tools is at your own risk and discretion. Future new features/services will also be subject to these Terms.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 8 - THIRD-PARTY LINKS</h2>
							<p className='text-stone-700 leading-relaxed'>
								Our Service may contain third-party materials or links to third-party websites not affiliated with us. We are not responsible for their content, accuracy, or liability for their materials, products, or services. Review third-party policies before engaging in transactions. Direct complaints or questions about third-party products to the third-party.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS</h2>
							<p className='text-stone-700 leading-relaxed'>
								Any comments, creative ideas, suggestions, proposals, or other materials you send us (solicited or unsolicited) can be used by us without restriction, compensation, or obligation to respond or maintain confidentiality. We may monitor, edit, or remove content we deem unlawful, offensive, or violating these Terms or intellectual property rights. You agree your comments will not violate any third-party rights, contain unlawful material, or include any virus or malware. You must not use a false email address or mislead us about the origin of comments. You are solely responsible for your comments and their accuracy. We assume no liability for comments posted by you or any third-party.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 10 - PERSONAL INFORMATION</h2>
							<p className='text-stone-700 leading-relaxed'>
								The submission of personal information is governed by our <Link to='/privacy-policy' className='text-stone-800 underline hover:text-stone-900'>Privacy Policy</Link>.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS</h2>
							<p className='text-stone-700 leading-relaxed'>
								Occasionally, the site or Service may contain errors, inaccuracies, or omissions (e.g., in pricing or availability). We reserve the right to correct these errors, change information, or cancel orders at any time without prior notice. We have no obligation to update information, except as required by law.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 12 - PROHIBITED USES</h2>
							<p className='text-stone-700 leading-relaxed'>
								You are prohibited from using the site or content for unlawful purposes, soliciting unlawful acts, violating regulations, infringing intellectual property, harassing, submitting false information, uploading malicious code, collecting personal information, spamming/scraping, for any obscene purpose, or interfering with security features. We reserve the right to terminate your use for violating these prohibitions.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY</h2>
							<p className='text-stone-700 leading-relaxed'>
								We do not guarantee that the service will be uninterrupted, timely, secure, or error-free, or that results will be accurate or reliable. You agree that your use of the service is at your sole risk. The service and all products/services delivered through it are provided 'as is' and 'as available' without warranties of any kind. Sabzar Foods and its affiliates will not be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages arising from your use of the service or any products procured using the service. Where exclusions/limitations of liability are not allowed, our liability shall be limited to the maximum extent permitted by law.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 14 - INDEMNIFICATION</h2>
							<p className='text-stone-700 leading-relaxed'>
								You agree to indemnify Sabzar Foods and its affiliates from any claim or demand, including attorneys' fees, made by any third-party due to or arising out of your breach of these Terms or violation of any law or third-party rights.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 15 - SEVERABILITY</h2>
							<p className='text-stone-700 leading-relaxed'>
								If any provision of these Terms is deemed unlawful or unenforceable, that provision shall be severed, and the remaining provisions shall remain valid and enforceable.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 16 - TERMINATION</h2>
							<p className='text-stone-700 leading-relaxed'>
								These Terms are effective until terminated by you or us. You may terminate at any time by notifying us or ceasing to use our site. If we suspect you have failed to comply with these Terms, we may terminate this agreement without notice, and you remain liable for all amounts due up to the date of termination.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 17 - ENTIRE AGREEMENT</h2>
							<p className='text-stone-700 leading-relaxed'>
								Our failure to enforce any right does not waive that right. These Terms, along with any posted policies, constitute the entire agreement between you and us, superseding any prior agreements. Ambiguities shall not be construed against the drafting party.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 18 - GOVERNING LAW</h2>
							<p className='text-stone-700 leading-relaxed'>
								These Terms and any separate agreements for Services shall be governed by the laws of India.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 19 - CHANGES TO TERMS OF SERVICE</h2>
							<p className='text-stone-700 leading-relaxed'>
								You can review the most current Terms on this page. We reserve the right to update, change, or replace any part of these Terms at our sole discretion by posting updates. It is your responsibility to check our website periodically. Your continued use constitutes acceptance of those changes.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>SECTION 20 - CONTACT INFORMATION</h2>
							<p className='text-stone-700 leading-relaxed'>
								Questions about the Terms should be sent to <a href='mailto:orders@sabzarfoods.in' className='text-stone-800 underline hover:text-stone-900'>orders@sabzarfoods.in</a>.
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TermsOfServicePage;

