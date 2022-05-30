import Head from "next/head";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { useRouter } from "next/router";
import { truncateAddress } from "../../utils";
import { useEffect, useRef, useState } from "react";

import {
	bet_abi,
	CRYPTO_BET_CONTRACT_ADDRESS,
	Lottery_abi,
	Lottery_CONTRACT_ADDRESS,
} from "../../constants";

import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Web3Modal from "web3modal";

export default function Bet() {
	const web3ModalRef = useRef();
	const [walletConnected, setWalletConnected] = useState(false);
	const [latestETHPrice, setLatestETHPrice] = useState();
	const [raffleState, setRaffleState] = useState(0);
	const [account, setAccount] = useState("");
	const [clock, setClock] = useState("0:0:0");
	const [betClock, setBetClock] = useState("0:0:0");
	const [timeInterval, setTimeInterval] = useState("0:0:0");
	const [timeIntervalLottery, setTimeIntervalLottery] = useState("0:0:0");

	const router = useRouter();

	/* Core Functions */
	const signerAddress = async () => {
		const signer = await getProviderOrSigner(true);
		const address = await signer.getAddress();
		setAccount(address);
	};

	const connectWallet = async () => {
		try {
			await getProviderOrSigner;
			setWalletConnected(true);
		} catch (err) {
			console.error(err);
		}
	};

	const disconnectWallet = async () => {
		await web3ModalRef.current.clearCachedProvider();
		setWalletConnected(false);
	};

	// Connecting to the Contract
	const getProviderOrSigner = async (needSigner = false) => {
		// Connect to Metamask
		const provider = await web3ModalRef.current.connect();
		const web3Provider = new providers.Web3Provider(provider);

		// If user is not connected to the Mumbai network, let them know and throw an error
		const { chainId } = await web3Provider.getNetwork();
		if (chainId !== 80001) {
			window.alert("Change the network to Mumbai");
			throw new Error("Change network to Mumbai");
		}

		if (needSigner) {
			const signer = web3Provider.getSigner();
			return signer;
		}
		return web3Provider;
	};

	setInterval(() => {
		if (walletConnected) {
			getLatestETHPrice();
			getRaffleState();
		}
	}, 5000);

	useEffect(() => {
		web3ModalRef.current = new Web3Modal({
			network: "mumbai",
			providerOptions: {},
			disableInjectedProvider: false,
		});
		connectWallet();
		signerAddress();
		getIntervalForBet();
		getIntervalForLottery();
		getStartTimeForBet();
		getStartTimeForLottery();
	}, [walletConnected]);

	/* Get Time Left */

	/* Contract Functions */
	const getLatestETHPrice = async () => {
		try {
			const provider = await getProviderOrSigner();

			const contract = new Contract(
				CRYPTO_BET_CONTRACT_ADDRESS,
				bet_abi,
				provider
			);

			const price = await contract.getLatestPriceETH();
			price = utils.formatUnits(price, 4) * 10000;
			// setPrevLatestETHPrice(latestETHPrice);
			setLatestETHPrice(price);
		} catch (error) {
			console.log(error);
		}
	};

	const getRaffleState = async () => {
		try {
			const provider = await getProviderOrSigner();

			const contract = new Contract(
				Lottery_CONTRACT_ADDRESS,
				Lottery_abi,
				provider
			);

			const res = await contract.getRaffleState();
			const state = BigNumber.from(res).toNumber();
			setRaffleState(state);
		} catch (error) {
			console.log(error);
		}
	};

	const getStartTimeForBet = async () => {
		try {
			const provider = await getProviderOrSigner();

			const contract = new Contract(
				CRYPTO_BET_CONTRACT_ADDRESS,
				bet_abi,
				provider
			);
			const stamp = await contract.getLastTimeStamp();
			const time = BigNumber.from(stamp).toNumber();
			const hours = Math.floor(time / 3600) % 24;
			const minutes = Math.floor(time / 60) % 60;
			const seconds = Math.floor(time % 60);
			setClock(
				(hours > 9 ? hours : `0${hours}`) +
					":" +
					(minutes > 9 ? minutes : `0${minutes}`) +
					":" +
					(seconds > 9 ? seconds : `0${seconds}`)
			);
		} catch (error) {
			console.log(error);
		}
	};

	const getStartTimeForLottery = async () => {
		try {
			const provider = await getProviderOrSigner();

			const contract = new Contract(
				Lottery_CONTRACT_ADDRESS,
				Lottery_abi,
				provider
			);
			const stamp = await contract.getLastTimeStamp();
			const time = BigNumber.from(stamp).toNumber();
			const hours = Math.floor(time / 3600) % 24;
			const minutes = Math.floor(time / 60) % 60;
			const seconds = Math.floor(time % 60);
			setBetClock(
				(hours > 9 ? hours : `0${hours}`) +
					":" +
					(minutes > 9 ? minutes : `0${minutes}`) +
					":" +
					(seconds > 9 ? seconds : `0${seconds}`)
			);
		} catch (error) {
			console.log(error);
		}
	};

	const getIntervalForBet = async () => {
		try {
			const provider = await getProviderOrSigner();

			const contract = new Contract(
				CRYPTO_BET_CONTRACT_ADDRESS,
				bet_abi,
				provider
			);
			const stamp = await contract.getInterval();
			const time = BigNumber.from(stamp).toNumber();
			const hours = Math.floor(time / 3600) % 24;
			const minutes = Math.floor(time / 60) % 60;
			const seconds = Math.floor(time % 60);
			setTimeInterval(
				(hours > 9 ? hours : `0${hours}`) +
					":" +
					(minutes > 9 ? minutes : `0${minutes}`) +
					":" +
					(seconds > 9 ? seconds : `0${seconds}`)
			);
		} catch (error) {
			console.log(error);
		}
	};

	const getIntervalForLottery = async () => {
		try {
			const provider = await getProviderOrSigner();

			const contract = new Contract(
				Lottery_CONTRACT_ADDRESS,
				Lottery_abi,
				provider
			);
			const stamp = await contract.getInterval();
			const time = BigNumber.from(stamp).toNumber();
			const hours = Math.floor(time / 3600) % 24;
			const minutes = Math.floor(time / 60) % 60;
			const seconds = Math.floor(time % 60);
			setTimeIntervalLottery(
				(hours > 9 ? hours : `0${hours}`) +
					":" +
					(minutes > 9 ? minutes : `0${minutes}`) +
					":" +
					(seconds > 9 ? seconds : `0${seconds}`)
			);
		} catch (error) {
			console.log(error);
		}
	};

	const renderButton = () => {
		if (!walletConnected) {
			return (
				<button
					className='font-bold text-white bg-secondary-color shadow-md shadow-glow border-0 py-3 px-24 focus:outline-none rounded text-lg transition-all duration-500 ease-in-out hover:scale-90'
					onClick={connectWallet}>
					Connect Wallet
				</button>
			);
		}

		if (walletConnected) {
			return (
				<button
					className='font-bold text-white border-secondary-color border-2  py-3 px-24 focus:outline-none rounded text-lg transition-all duration-500 ease-in-out '
					onClick={disconnectWallet}>
					Wallet Connected!
				</button>
			);
		}
	};

	return (
		<main className='bg-gradient-to-br from-tertiary-color via-main to-tertiary-color'>
			<Head>
				<title>Dashboard | Safe Bet</title>
				<meta name='msapplication-TileColor' content='#da532c' />
				<meta name='theme-color' content='#ffffff' />
			</Head>
			<div className='min-h-screen flex flex-col justify-between w-full'>
				<Navbar
					option1='Crypto Bet'
					link1='/Dashboard/Bet'
					option2='Lottery Game'
					link2='/Dashboard/Lottery'
					page='Crypto Bet'
				/>
				<div className='pattern w-full min-h-screen flex justify-center items-center flex-col'>
					<h1 className='xl:text-8xl text-6xl mb-4 font-medium text-white text-center w-full mt-12'>
						<span className='font-bebas text-white'>
							Welcome to
						</span>{" "}
						<span className='font-bebas text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet'>
							SafeBet
						</span>
					</h1>

					{renderButton()}

					<i>
						<p className='text-white mt-8 text-xl text-center px-4'>
							<strong>Disclaimer: </strong>Please make sure that
							you have atleast 1 MATIC in your wallet
						</p>
					</i>

					<main className='mt-12 bg-gray-900 w-full lg:w-9/12  overflow-hidden relative border'>
						<div className='flex items-start justify-between'>
							<div className='flex flex-col w-full md:space-y-4'>
								<div className='overflow-auto  pb-24 px-4 md:px-6 pt-16'>
									<h1 className='text-4xl font-semibold text-white'>
										Hey There, {truncateAddress(account)}
									</h1>
									<h2 className='text-md text-gray-400'>
										An Overview Of Your Account
									</h2>
									<div className='flex my-6 items-center w-full space-y-4 md:space-x-4 md:space-y-0 flex-col md:flex-row'>
										<div className='w-full md:w-6/12'>
											<div className='shadow-lg w-full bg-gray-800 relative overflow-hidden'>
												<div className='w-full h-full block'>
													<div className='flex flex-col gap-5 items-center justify-between px-4 py-6 space-x-4'>
														<div className='flex items-center'>
															<span className='rounded-full relative p-5 bg-purple-900'>
																<svg
																	width='40'
																	fill='#E8219A'
																	height='40'
																	className='text-yellow-500 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
																	viewBox='0 0 1792 1792'
																	xmlns='http://www.w3.org/2000/svg'>
																	<path d='M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z'></path>
																</svg>
															</span>
															<p className='text-sm text-white ml-2 font-semibold border-b border-gray-200'>
																CryptoBet
															</p>
														</div>
														<div className='border-b border-gray-200 mt-0 text-white font-bold text-xl'>
															Current ETH Price: $
															{Math.round(
																latestETHPrice
															)}
														</div>
													</div>
												</div>
												<div className='text-white px-8 pb-8'>
													<div className='flex items-center pb-2 mb-2 text-sm sm:space-x-12  justify-between border-b border-gray-200'>
														<p>Last Time</p>
														<div className='flex items-end text-xs'>
															{clock}
														</div>
													</div>
													<div className='flex items-center mb-2 pb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200'>
														<p>Time Left</p>
														<div className='flex items-end text-xs'>
															{timeInterval}
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className='w-full md:w-6/12'>
											<div className='shadow-lg w-full bg-gray-800 relative overflow-hidden'>
												<a
													href='#'
													className='w-full h-full block'>
													<div className='flex flex-col items-center justify-between px-4 py-6 gap-5 space-x-4'>
														<div className='flex items-center'>
															<span className='rounded-full relative p-5 bg-purple-900'>
																<svg
																	width='40'
																	fill='#E8219A'
																	height='40'
																	className='text-yellow-500 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
																	viewBox='0 0 1792 1792'
																	xmlns='http://www.w3.org/2000/svg'>
																	<path d='M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z'></path>
																</svg>
															</span>
															<p className='text-sm text-white ml-2 font-semibold border-b border-gray-200'>
																Lottery Game
															</p>
														</div>
														<div className='border-b border-gray-200 mt-0 text-white font-bold text-xl'>
															Lottery State:{" "}
															{raffleState == 0
																? "Started!"
																: "Paused"}
														</div>
													</div>
												</a>
												<div className='text-white px-8 pb-8'>
													<div className='flex items-center pb-2 mb-2 text-sm sm:space-x-12  justify-between border-b border-gray-200'>
														<p>Time Started</p>
														<div className='flex items-end text-xs'>
															{" "}
															{clock}{" "}
														</div>
													</div>
													<div className='flex items-center mb-2 pb-2 text-sm space-x-12 md:space-x-24 justify-between border-b border-gray-200'>
														<p>Time Left</p>
														<div className='flex items-end text-xs'>
															{
																timeIntervalLottery
															}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</main>
				</div>
				<Footer />
			</div>
		</main>
	);
}
