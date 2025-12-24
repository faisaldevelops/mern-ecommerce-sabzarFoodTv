import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ShippingPolicyPage = () => {
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
					<h1 className='text-3xl font-bold text-stone-900 mb-2'>Shipping Policy</h1>
					<p className='text-sm text-stone-600 mb-8'>Last updated: 19th December 2025</p>

					<div className='prose prose-stone max-w-none space-y-6'>
						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>Interpretation and Definitions</h2>
							
							<h3 className='text-lg font-medium text-stone-800 mb-3 mt-4'>Interpretation</h3>
							<p className='text-stone-700 leading-relaxed mb-4'>
								The words of which the initial letter is capitalised have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
							</p>

							<h3 className='text-lg font-medium text-stone-800 mb-3 mt-4'>Definitions</h3>
							<p className='text-stone-700 leading-relaxed mb-2'>
								For the purposes of this Shipping Policy:
							</p>
							<ul className='list-disc list-inside text-stone-700 space-y-2 ml-4'>
								<li><strong className='text-stone-900'>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Main Chowk, Kupwara, India 193222.</li>
								<li><strong className='text-stone-900'>Goods</strong> refer to the items offered for sale on the Service.</li>
								<li><strong className='text-stone-900'>Orders</strong> mean a request by You to purchase Goods from Us.</li>
								<li><strong className='text-stone-900'>Service</strong> refers to the Website.</li>
								<li><strong className='text-stone-900'>Website</strong> refers to Sabzar Foods, accessible from <a href='https://www.sabzarfoods.in' target='_blank' rel='noopener noreferrer' className='text-stone-800 underline hover:text-stone-900'>https://www.sabzarfoods.in</a></li>
								<li><strong className='text-stone-900'>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
							</ul>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>Shipping Duration</h2>
							<p className='text-stone-700 leading-relaxed mb-4'>
								We endeavour but do not guarantee to deliver the products to buyers within the suggested shipping times mentioned below:
							</p>
							
							<div className='mb-6'>
								<p className='text-stone-700 leading-relaxed mb-3 font-medium'>
									<strong className='text-stone-900'>FREE / COD SHIPPING - DELHIVERY Surface + Bluedart Surface*</strong>
								</p>
								<div className='overflow-x-auto'>
									<table className='min-w-full border border-stone-300 text-sm'>
										<thead className='bg-stone-100'>
											<tr>
												<th className='border border-stone-300 px-4 py-2 text-left text-stone-900 font-semibold'>Zone</th>
												<th className='border border-stone-300 px-4 py-2 text-left text-stone-900 font-semibold'>Duration</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>DELHI/NCR</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>1-2 business days</td>
											</tr>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>NORTH Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>2-4 business days</td>
											</tr>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>CENTRAL & WEST Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>3-5 business days</td>
											</tr>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>SOUTH Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>4-8 business days</td>
											</tr>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>EAST Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>4-5 business days</td>
											</tr>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>NORTH EAST Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>6-15 business days</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							<div className='mb-6'>
								<p className='text-stone-700 leading-relaxed mb-3 font-medium'>
									<strong className='text-stone-900'>EXPRESS SHIPPING - BLUEDART*</strong>
								</p>
								<div className='overflow-x-auto'>
									<table className='min-w-full border border-stone-300 text-sm'>
										<thead className='bg-stone-100'>
											<tr>
												<th className='border border-stone-300 px-4 py-2 text-left text-stone-900 font-semibold'>Zone</th>
												<th className='border border-stone-300 px-4 py-2 text-left text-stone-900 font-semibold'>Duration</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>NORTH Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>1-2 business days</td>
											</tr>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>CENTRAL & WEST Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>2-3 business days</td>
											</tr>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>EAST Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>2-3 business days</td>
											</tr>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>NORTH EAST Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>4-5 business days</td>
											</tr>
											<tr>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>SOUTH Zone</td>
												<td className='border border-stone-300 px-4 py-2 text-stone-700'>2-3 business days</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							<p className='text-stone-700 leading-relaxed mb-4 text-sm italic'>
								*Orders placed before 11 AM are usually processed and dispatched the same day. All shipments are packed and manifested for dispatch within 2 business days of placing the order. We currently dispatch orders from our South Delhi warehouse location.
							</p>

							<p className='text-stone-700 leading-relaxed mb-4'>
								Other factors leading to a delay in delivery may be through the courier partner, transporters' strike, holidays etc. We will not be held responsible for any such delays. We reserve the right to make delivery of the goods by instalments. If the goods are to be delivered in instalments, each delivery will constitute a separate contract. You may not treat the contract (as a whole) as repudiated if we fail to deliver any one or more of the instalments or if you have a claim in respect of any one or more of the instalments. If you fail to take delivery of the goods, we may at our discretion charge you for the additional shipping cost.
							</p>

							<p className='text-stone-700 leading-relaxed mb-4'>
								If you have specified a third party recipient for delivery purposes (for example as a gift) then you accept that evidence of a porch delivery at the address given (or at that delivery address) is evidence of delivery and fulfilment by us of our obligation. Also, an optional sms with multiple delivery options is shared by our delivery partner wherever the service is available. Choosing an option is not mandatory, however, in the case, a customer chooses a custom delivery option, all liabilities of service / product delivery now would transfer to the customer, and we will be absolved of responsibility, thus evidence of delivery and fulfilment by us of our obligation. Estimated delivery times are to be used as a guide only and commence from the date of dispatch. We are not responsible for any delays caused by third party delivery agencies and/or due to time required for statutory clearances during the delivery process.
							</p>

							<p className='text-stone-700 leading-relaxed mb-4'>
								Further, we may at times be unable to deliver the confirmed order(s) to you and the reason for the same could be inclusive of but not limited to the following:
							</p>
							<ol className='list-decimal list-inside text-stone-700 space-y-1 ml-4 mb-4'>
								<li>unavailability of the relevant product;</li>
								<li>failure of the concerned manufacturer/supplier/designer/importer to deliver relevant product to us;</li>
								<li>poor/improper/defective quality of the relevant product ascertained through our quality audit process; and</li>
								<li>inaccuracies or errors in product or pricing information. In the event of any circumstance(s) as aforementioned; you shall not be entitled to any damages or monetary compensation.</li>
							</ol>

							<p className='text-stone-700 leading-relaxed mb-4'>
								In the event we are unable to deliver the confirmed order(s) as mentioned herein above and the payment for such order(s) has been made by you through your credit/debit card, the amount paid by you while placing the order(s) on the Site will be reversed back in your card account. No refunds shall be applicable on the orders made by the Users under the Cash on Delivery ("COD") option.
							</p>

							<p className='text-stone-700 leading-relaxed mb-4'>
								In case you do not receive your order within the specified time please get in touch with us at:
							</p>
							<ul className='list-disc list-inside text-stone-700 space-y-1 ml-4 mb-6'>
								<li>Email: <a href='mailto:orders@sabzarfoods.in' className='text-stone-800 underline hover:text-stone-900'>orders@sabzarfoods.in</a></li>
								<li>WhatsApp: <a href='http://wa.me/917051896324' target='_blank' rel='noopener noreferrer' className='text-stone-800 underline hover:text-stone-900'>Click here</a></li>
							</ul>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>Free Shipping</h2>
							<p className='text-stone-700 leading-relaxed mb-4'>
								Free shipping is only applicable on all prepaid orders above Rs 1499. This is only valid if the order is sent to one address. In the case of gifting and customised orders which you order from us through phone or email additional charges may be incurred on shipping. Our shipping partners are Bluedart, Delhivery, Amazon Shipping, Xpressbees, DTDC and India Post under Free Shipping.
							</p>
						</section>

						<section>
							<h2 className='text-xl font-semibold text-stone-900 mb-3'>Express Shipping</h2>
							<p className='text-stone-700 leading-relaxed mb-4'>
								Express Shipping is only applicable on prepaid orders where the express shipping option is added. Our shipping partner is Bluedart Express. Express Shipping is subject to pincode serviceability. If the pincode is not serviceable, we will contact you first, after which you will have the option to take a refund on the shipping amount and continue with another shipping option as mutually discussed.
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShippingPolicyPage;

