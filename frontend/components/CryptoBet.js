import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { BigNumber, Contract, providers, utils } from "ethers";
import { CRYPTO_BET_CONTRACT_ADDRESS, bet_abi } from "../constants";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";
import Web3Modal from "web3modal";

const CryptoBet = () => {
	const web3ModalRef = useRef();
	const divRef = useRef();
	const [walletConnected, setWalletConnected] = useState(false);
	const [entryFee, setEntryFee] = useState(0);

	const [latestETHPrice, setLatestETHPrice] = useState(0);
	const [prevETHPrice, setPrevETHPrice] = useState(0);
	const [upBetterCount, setUpBetterCount] = useState("0");
	const [downBettorCount, setDownBettorCount] = useState("0");

	useEffect(() => {
		web3ModalRef.current = new Web3Modal({
			network: "mumbai",
			providerOptions: {},
			disableInjectedProvider: false,
		});

		connectWallet();
		getEntryFee();
	}, []);

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

	const connectWallet = async () => {
		try {
			await getProviderOrSigner;
			setWalletConnected(true);
		} catch (err) {
			console.error(err);
		}
	};

	setInterval(() => {
		if (walletConnected) {
			getLatestETHPrice();
			// getDownBettors();
			// getUpBettor();
		}
	}, 3000);

	const placeBetDown = async (amount) => {
		try {
			if (!walletConnected) {
				window.alert("No wallet connected");
				throw new Error("Wallet Not Connected!");
			} else {
				console.log("wallet is connected");
			}

			const signer = await getProviderOrSigner(true);

			const contract = new Contract(
				CRYPTO_BET_CONTRACT_ADDRESS,
				bet_abi,
				signer
			);

			const tx = await contract.placeBetDown({
				value: utils.parseEther(amount),
			});

			await tx.wait();
			alert("Down Bet Placed!");
		} catch (error) {
			console.log(error);
		}
	};

	const placeBetUp = async (amount) => {
		try {
			console.log("This is Working");
			if (!walletConnected) {
				window.alert("No wallet connected");
				throw new Error("Wallet Not Connected!");
			} else {
				console.log("wallet is connected");
			}

			const signer = await getProviderOrSigner(true);

			const contract = new Contract(
				CRYPTO_BET_CONTRACT_ADDRESS,
				bet_abi,
				signer
			);

			const tx = await contract.placeBetUp({
				value: utils.parseEther(amount),
			});

			await tx.wait();
		} catch (error) {
			console.log(error);
		}
	};

	const getUpBettor = async () => {
		try {
			if (!walletConnected) {
				window.alert("No wallet connected");
				throw new Error("Wallet Not Connected!");
			}

			const signer = await getProviderOrSigner();

			const contract = new Contract(
				CRYPTO_BET_CONTRACT_ADDRESS,
				bet_abi,
				signer
			);

			const tx = await contract.getLengthOfUpBettors();
			console.log(tx);
			const length = BigNumber(tx).from(tx).toString();
			setUpBetterCount(length);
		} catch (error) {
			console.log(error);
		}
	};

	const getDownBettors = async () => {
		try {
			if (!walletConnected) {
				window.alert("No wallet connected");
				throw new Error("Wallet Not Connected!");
			}

			const provider = await getProviderOrSigner();

			const contract = new Contract(
				CRYPTO_BET_CONTRACT_ADDRESS,
				bet_abi,
				provider
			);

			const tx = await contract.getLengthOfDownBettors();
			const length = BigNumber(tx).from(tx).toString();
			setDownBettorCount(length);
		} catch (error) {
			console.log(error);
		}
	};

	const getEntryFee = async () => {
		try {
			/* if (!walletConnected) {
        window.alert("No wallet connected")
        throw new Error("Wallet Not Connected!")
      } */

			const signer = await getProviderOrSigner();

			const contract = new Contract(
				CRYPTO_BET_CONTRACT_ADDRESS,
				bet_abi,
				signer
			);

			const tx = await contract.getEntranceFee();
			const fee = BigNumber.from(tx).toString() / 10 ** 18;
			setEntryFee(fee);
			// await tx.wait();
		} catch (error) {
			console.log(error);
		}
	};

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
			setPrevETHPrice(latestETHPrice);
			setLatestETHPrice(price);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='min-h-screen flex flex-col justify-center w-full'>
			<Head>
				<title>Crypto Bet | Safe Bet</title>
				<meta name='msapplication-TileColor' content='#da532c' />
				<meta name='theme-color' content='#ffffff' />
			</Head>
			<Navbar
				option1='Crypto Bet'
				link1='/Dashboard/Bet'
				option2='Lottery Game'
				link2='/Dashboard/Lottery'
				page='Crypto Bet'
			/>
			<main className='pattern rounded-2xl h-screen lg:h-90vh 3xl:h-80vh overflow-hidden relative'>
				<div className='flex  items-center justify-center'>
					<div className='flex flex-col w-full pl-0 md:p-4 md:space-y-4'>
						<header className='w-full shadow-lg bg-white dark:bg-gray-900 items-center h-24 rounded-2xl z-40'>
							<div className='relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center'>
								<div className='relative items-center pl-1 flex w-full lg:max-w-68 sm:pr-2 sm:ml-0'>
									<div className='relative p-1 flex items-center justify-center w-full ml-5 mr-4 sm:mr-0 sm:right-auto'>
										<h1 className='text-white font-bebas text-4xl tracking-wider'>
											CryptoBet
										</h1>
									</div>
								</div>
							</div>
						</header>
						<div className='overflow-auto h-screen pb-24 pt-2 pr-2 pl-2 md:pt-0 md:pr-0 md:pl-0'>
							<div className='flex flex-col flex-wrap sm:flex-row '>
								{/* Column 1 */}
								<div className='w-full sm:w-1/2 '>
									{/* row 1 */}
									<div className='mb-4 lg:mx-8'>
										<div className=' shadow-lg rounded-2xl p-4 bg-gray-900 w-full h-screen-1/2 flex flex-col justify-center'>
											<h1 className='text-6xl mb-4 font-medium text-white text-center w-full'>
												<span className='font-bebas text-white'>
													Start
												</span>{" "}
												<span className='font-bebas text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet'>
													Betting
												</span>
											</h1>
											<h2 className='text-white text-center text-3xl font-light'>
												<i>Entry Fee: 1.1 MATIC</i>{" "}
												<span className='font-bold text-base tracking-wider'>
													(atleast)
												</span>
											</h2>
											<div className='mt-8 flex justify-center items-center w-full'>
												<button
													onClick={() =>
														placeBetUp("1.1")
													}
													className='border-2 border-secondary-color p-4 rounded-full mx-8 transition-all duration-500 ease-in-out hover:scale-90'>
													<svg
														width='30px'
														height='30px'
														viewBox='0 0 30 30'
														id='_24_-_Up'
														data-name='24 - Up'
														fill='#E8219A'
														xmlns='http://www.w3.org/2000/svg'>
														<path
															id='Path_213'
															data-name='Path 213'
															d='M16,1A15,15,0,1,0,31,16,15.007,15.007,0,0,0,16,1Zm0,2A13,13,0,1,1,3,16,13.006,13.006,0,0,1,16,3Z'
															transform='translate(-1 -1)'
															fillRule='evenodd'
														/>
														<path
															id='Path_214'
															data-name='Path 214'
															d='M10.707,19.707,16,14.414l5.293,5.293a1,1,0,1,0,1.414-1.414l-6-6a1,1,0,0,0-1.414,0l-6,6a1,1,0,0,0,1.414,1.414Z'
															transform='translate(-1 -1)'
															fillRule='evenodd'
														/>
													</svg>
												</button>
												<h2 className='text-white text-2xl lg:text-3xl text-center font-bold'>
													UP or DOWN
												</h2>
												<button
													onClick={() =>
														placeBetDown("1.1")
													}
													className='border-2 border-secondary-color p-4 rounded-full mx-8 transition-all duration-500 ease-in-out hover:scale-90'>
													<svg
														width='30px'
														height='30px'
														viewBox='0 0 30 30'
														id='_22_-_Down'
														fill='#E8219A'
														data-name='22 - Down'
														xmlns='http://www.w3.org/2000/svg'>
														<path
															id='Path_209'
															data-name='Path 209'
															d='M16,1A15,15,0,1,0,31,16,15.007,15.007,0,0,0,16,1Zm0,2A13,13,0,1,1,3,16,13.006,13.006,0,0,1,16,3Z'
															transform='translate(-1 -1)'
															fillRule='evenodd'
														/>
														<path
															id='Path_210'
															data-name='Path 210'
															d='M21.293,12.293,16,17.586l-5.293-5.293a1,1,0,0,0-1.414,1.414l6,6a1,1,0,0,0,1.414,0l6-6a1,1,0,1,0-1.414-1.414Z'
															transform='translate(-1 -1)'
															fillRule='evenodd'
														/>
													</svg>
												</button>
											</div>
										</div>
									</div>
									{/* row 2 */}
								</div>
								{/* COLUMN 2 */}
								{/* <div className='w-full sm:w-1/2 xl:w-1/3'>
									<div className='mb-4 mb-4 mx-0 sm:ml-4 xl:mr-4'>
										<div className='shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-900 w-full'>
											<h2 className='p-4 text-5xl text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet font-bebas tracking-wider'>
												Disclaimer
											</h2>
											<p className='px-4 pb-4 text-white'>
												Please Make Sure You Have More
												Than &nbsp;
												<span className='text-xl '>
													<strong>
														{entryFee} MATIC
													</strong>
												</span>{" "}
												&nbsp; in Your Account before
												Betting.
											</p>
										</div>
									</div> */}
								{/* row 1 */}
								{/* <div className='mb-4 mx-0 sm:ml-4 xl:mr-4'>
										<div className='shadow-lg rounded-2xl bg-white dark:bg-gray-900 w-full'>
											<p className='font-bold text-2xl p-4 text-black dark:text-white'>
												Total Up Bettors
											</p>

											<p className='flex flex-row items-center font-bold text-7xl px-4 text-black dark:text-white'>
												{upBetterCount}&nbsp;
												
												<svg
													width='32px'
													height='32px'
													viewBox='0 0 32 32'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'>
													<path
														fillRule='evenodd'
														clipRule='evenodd'
														d='M2.00049 16C2.00049 8.26801 8.2685 2 16.0005 2C23.7325 2 30.0005 8.26801 30.0005 16C30.0005 23.732 23.7325 30 16.0005 30C8.2685 30 2.00049 23.732 2.00049 16ZM20.2934 16.7071C20.6839 17.0976 21.3171 17.0976 21.7076 16.7071C22.0981 16.3166 22.0981 15.6834 21.7076 15.2929L16.7076 10.2929C16.3171 9.90237 15.6839 9.90237 15.2934 10.2929L10.2934 15.2929C9.90286 15.6834 9.90286 16.3166 10.2934 16.7071C10.6839 17.0976 11.3171 17.0976 11.7076 16.7071L15.0005 13.4142V21C15.0005 21.5523 15.4482 22 16.0005 22C16.5528 22 17.0005 21.5523 17.0005 21V13.4142L20.2934 16.7071Z'
														fill='green'
													/>
												</svg>
											</p>

											<p className='font-bold text-2xl p-4 text-black dark:text-white'>
												Total Down Bettors
											</p>

											<p className='flex flex-row items-center font-bold text-7xl px-4 pb-4 text-black dark:text-white'>
												{downBettorCount}&nbsp;
												
												<svg
													width='32px'
													height='32px'
													viewBox='0 0 32 32'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'>
													<path
														fillRule='evenodd'
														clipRule='evenodd'
														d='M1.99951 16C1.99951 8.26801 8.26753 2 15.9995 2C23.7315 2 29.9995 8.26801 29.9995 16C29.9995 23.732 23.7315 30 15.9995 30C8.26753 30 1.99951 23.732 1.99951 16ZM11.7066 15.2929C11.3161 14.9024 10.6829 14.9024 10.2924 15.2929C9.90188 15.6834 9.90188 16.3166 10.2924 16.7071L15.2924 21.7071C15.6829 22.0976 16.3161 22.0976 16.7066 21.7071L21.7066 16.7071C22.0971 16.3166 22.0971 15.6834 21.7066 15.2929C21.3161 14.9024 20.6829 14.9024 20.2924 15.2929L16.9995 18.5858V11C16.9995 10.4477 16.5518 10 15.9995 10C15.4472 10 14.9995 10.4477 14.9995 11V18.5858L11.7066 15.2929Z'
														fill='red'
													/>
												</svg>
											</p>
										</div>
									</div> */}
								{/* row 2 */}
								{/* </div> */}

								{/* COLUMN: 3 */}
								<div className='w-full sm:w-1/2'>
									{/* row 1 */}

									{/* row 2 */}
									<div className='mb-4'>
										<div className='shadow-lg rounded-2xl bg-gray-900 w-full h-screen-1/2 flex flex-col justify-center items-center'>
											<p className='font-bebas text-4xl lg:text-5xl tracking-wider p-4 text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet'>
												Current ETH Price
											</p>
											<p className=' text-2xl p-4 text-black dark:text-white'>
												${latestETHPrice} USD
												{/* 
                          TODO: Add ETH Price 
                          */}
											</p>
											<p className='font-bebas text-4xl lg:text-5xl tracking-wider p-4 text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet'>
												Last ETH Price{" "}
												<em className='text-sm text-white'>
													(3 seconds before)
												</em>
											</p>
											<p className='text-2xl p-4 text-black dark:text-white'>
												${prevETHPrice} USD
												{/*
                          TODO: Add previous ETH Price 
                        */}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default CryptoBet;
