import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, KeyRound, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
	const [step, setStep] = useState("phone"); // "phone" or "otp"
	const [phoneNumber, setPhoneNumber] = useState("");
	const [otp, setOtp] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const { checkAuth } = useUserStore();

	const handleSendOTP = async (e) => {
		e.preventDefault();
		
		if (!/^\d{10}$/.test(phoneNumber)) {
			toast.error("Please enter a valid 10-digit phone number");
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post("/otp/send", { phoneNumber, isSignup: true });
			toast.success(response.data.message);
			
			// In development, show OTP in toast
			if (response.data.otp) {
				toast.success(`Dev Mode - OTP: ${response.data.otp}`, { duration: 10000 });
			}
			
			setStep("otp");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to send OTP");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOTP = async (e) => {
		e.preventDefault();
		
		if (!otp || otp.length !== 6) {
			toast.error("Please enter the 6-digit OTP");
			return;
		}

		if (!name.trim()) {
			toast.error("Please enter your name");
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post("/otp/verify", {
				phoneNumber,
				otp,
				name: name.trim(),
			});
			
			toast.success(response.data.message);
			
			// Refresh auth state
			await checkAuth();
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to verify OTP");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-900'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h2 className='text-center text-4xl font-bold text-emerald-400 mb-2'>
					{step === "phone" ? "Create Account" : "Verify Code"}
				</h2>
				<p className='text-center text-sm text-gray-400'>
					{step === "phone" ? "Enter your phone number to get started" : `Code sent to +91${phoneNumber}`}
				</p>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<div className='bg-gray-800 py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-700'>
					{step === "phone" ? (
						<form onSubmit={handleSendOTP} className='space-y-5'>
							<div>
								<label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-300 mb-2'>
									Phone Number
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<Phone className='h-5 w-5 text-gray-500' />
									</div>
									<input
										id='phoneNumber'
										type='tel'
										required
										value={phoneNumber}
										onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
										className='block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 
										rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 
										focus:border-transparent sm:text-sm transition-all'
										placeholder='10-digit mobile number'
									/>
								</div>
							</div>

							<button
								type='submit'
								className='w-full flex justify-center items-center py-3 px-4 
								rounded-xl shadow-lg text-sm font-semibold text-white bg-emerald-600
								hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800
								transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader className='mr-2 h-5 w-5 animate-spin' />
										Sending...
									</>
								) : (
									<>
										<Phone className='mr-2 h-5 w-5' />
										Send Verification Code
									</>
								)}
							</button>
						</form>
					) : (
						<form onSubmit={handleVerifyOTP} className='space-y-5'>
							<div>
								<label htmlFor='name' className='block text-sm font-medium text-gray-300 mb-2'>
									Full Name
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<User className='h-5 w-5 text-gray-500' />
									</div>
									<input
										id='name'
										type='text'
										required
										value={name}
										onChange={(e) => setName(e.target.value)}
										className='block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 
										rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 
										focus:border-transparent sm:text-sm transition-all'
										placeholder='John Doe'
									/>
								</div>
							</div>

							<div>
								<label htmlFor='otp' className='block text-sm font-medium text-gray-300 mb-2'>
									Verification Code
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<KeyRound className='h-5 w-5 text-gray-500' />
									</div>
									<input
										id='otp'
										type='text'
										required
										value={otp}
										onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
										className='block w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 
										rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 
										focus:border-transparent sm:text-sm text-center text-lg tracking-widest transition-all'
										placeholder='000000'
										maxLength={6}
									/>
								</div>
							</div>

							<button
								type='submit'
								className='w-full flex justify-center items-center py-3 px-4 
								rounded-xl shadow-lg text-sm font-semibold text-white bg-emerald-600
								hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800
								transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader className='mr-2 h-5 w-5 animate-spin' />
										Verifying...
									</>
								) : (
									<>
										<KeyRound className='mr-2 h-5 w-5' />
										Verify & Create Account
									</>
								)}
							</button>

							<button
								type="button"
								onClick={() => {
									setStep("phone");
									setOtp("");
								}}
								className="w-full text-sm text-emerald-400 hover:text-emerald-300 transition-colors py-2"
								disabled={loading}
							>
								← Change phone number
							</button>
						</form>
					)}

					<div className='mt-6 text-center'>
						<p className='text-sm text-gray-400'>
							Already have an account?{" "}
							<Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300 transition-colors'>
								Sign in <ArrowRight className='inline h-4 w-4' />
							</Link>
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
};
export default SignUpPage;
