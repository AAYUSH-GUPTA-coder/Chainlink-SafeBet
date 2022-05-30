import Head from "next/head";
import React from "react";
import Betting from "../../components/Betting";
import { useRef, useState, useEffect } from "react";
import { BigNumber, Contract, providers, utils } from "ethers";
import Web3Modal from "web3modal";
import {
  Lottery_abi,
  Lottery_CONTRACT_ADDRESS,
} from "../../constants";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const Lotter = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [entryFee, setEntryFee] = useState(0);
  const [recentWinner, setRecentWinner] = useState("");
  const [raffleState, setRaffleState] = useState(0);
  const [clock, setClock] = useState("0:0:0");
  const [timeInterval, setTimeInterval] = useState("0:0:0");

  const web3ModalRef = useRef();

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

  // Functions
  const getEntryFee = async () => {
    try {
      const provider = await getProviderOrSigner();

      const contract = new Contract(
        Lottery_CONTRACT_ADDRESS,
        Lottery_abi,
        provider
      );

      const entryFee = await contract.getEntranceFee();
      entryFee = utils.formatEther(entryFee);
      setEntryFee(entryFee);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecentWinner = async () => {
    try {
      const provider = await getProviderOrSigner();

      const contract = new Contract(
        Lottery_CONTRACT_ADDRESS,
        Lottery_abi,
        provider
      );

      const winners = await contract.getRecentWinner();
      setRecentWinner(winners);
    } catch (error) {
      console.log(error);
    }
  };

  const enterRaffle = async (amount) => {
    try {
      const provider = await getProviderOrSigner(true);
      const contract = new Contract(
        Lottery_CONTRACT_ADDRESS,
        Lottery_abi,
        provider
      );

      const tx = await contract.enterRaffle({
        value: utils.parseEther(amount),
      });

      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const getParticipantCount = async () => {
    try {
      const provider = await getProviderOrSigner();

      const contract = new Contract(
        Lottery_CONTRACT_ADDRESS,
        Lottery_abi,
        provider
      );

      const res = await contract.getNumberOfPlayers();
      const count = BigNumber.from(res).toNumber();
      setParticipantCount(count);
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

  const getStartTime = async () => {
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

  const getInterval = async () => {
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

  const connectWallet = async () => {
    try {
      await getProviderOrSigner;
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "mumbai",
      providerOptions: {},
      disableInjectedProvider: false,
    });

    connectWallet();
    getEntryFee();
    getParticipantCount();
    getRaffleState();
    getRecentWinner();
    getStartTime();
    getInterval();
  }, []);

  return (
    <div className="bg-gradient-to-br from-tertiary-color via-main to-tertiary-color">
      <Head>
        <title>Lottery Game | Safe Bet</title>
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Navbar
        option1="Crypto Bet"
        link1="/Dashboard/Bet"
        option2="Lottery Game"
        link2="/Dashboard/Lottery"
        page="Crypto Bet"
      />
      <main className="pattern rounded-2xl h-screen lg:h-90vh 3xl:h-80vh overflow-hidden relative lg:mx-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
            <header className="w-full shadow-lg bg-gray-900 items-center h-24 rounded-2xl z-40">
              <div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
                <div className="relative items-center pl-1 flex w-full lg:max-w-68 sm:pr-2 sm:ml-0">
                  <div className="relative p-1 flex items-center justify-center w-full ml-5 mr-4 sm:mr-0 sm:right-auto">
                    <h1 className="text-white font-bebas text-4xl tracking-wider">
                      Lottery Game
                    </h1>
                  </div>
                </div>
              </div>
            </header>
            <div className="overflow-auto h-screen pb-24 pt-2 pr-2 pl-2 md:pt-0 md:pr-0 md:pl-0">
              <div className="flex flex-col flex-wrap sm:flex-row ">
                {/* Column 1 */}
                <div className="w-full sm:w-1/2 xl:w-1/3">
                  {/* row 1 */}
                  <div className="mb-4">
                    <div className="shadow-lg rounded-2xl p-4 bg-gray-900 w-full">
                      <h1 className="text-6xl mb-4 font-medium text-white text-center w-full">
                        <span className="font-bebas text-white">
                          Let&apos;s
                        </span>{" "}
                        <span className="font-bebas text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet">
                          Play
                        </span>
                      </h1>
                      <div className="mt-4 flex flex-col justify-center items-center w-full">
                        <h2 className="text-white text-3xl font-light">
                          <i>Entry Fee: {entryFee} MATIC</i>
                        </h2>
                        <button
                          onClick={() => enterRaffle("0.1")}
                          className="my-8 font-bold text-white bg-secondary-color shadow-md shadow-glow border-0 py-2 px-16 focus:outline-none rounded text-lg transition-all duration-500 ease-in-out hover:scale-90"
                        >
                          Pay
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* row 2 */}
                  <div className="mb-4">
                    <div className="shadow-lg rounded-2xl bg-gray-900 w-full">
                      <p className="font-bebas text-4xl p-4 text-white tracking-wider">
                        Total Number Of Players
                      </p>
                      <p className="font-bold text-6xl lg:text-7xl px-4 pb-4 text-white">
                        {participantCount}
                      </p>
                    </div>
                  </div>
                </div>
                {/* COLUMN 2 */}
                <div className="w-full sm:w-1/2 xl:w-1/3">
                  <div className="mb-4 sm:ml-4 xl:mr-4">
                    <div className="shadow-lg rounded-2xl bg-gray-900 w-full">
                      <p className="font-bebas text-4xl p-4 text-white tracking-wider">
                        Lottery State:
                      </p>
                      <p className="font-bold text-6xl px-4 pb-4 text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet">
                          {raffleState === 0
                            ? "Lottery Open!"
                            : "Lottery Paused."}
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* row 1 */}
                  <div className="mb-4 sm:ml-4 xl:mr-4">
                    <div className="shadow-lg rounded-2xl bg-gray-900 w-full">
                      <p className="font-bebas text-4xl tracking-wider pt-4 px-4 text-white">
                        Lottery Started At:
                      </p>
                      <p className=" text-2xl pb-4 px-4 font-bold text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet">
                        {clock}
                      </p>
                      <p className="font-bebas text-4xl  tracking-wider px-4 text-white">
                        Time Interval
                      </p>
                      <p className="text-2xl px-4 pb-4 text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet">
                        {timeInterval}
                      </p>
                    </div>
                  </div>
                  {/* row 2 */}
                </div>

                {/* COLUMN: 3 */}
                <div className="w-full sm:w-1/2 xl:w-1/3">
                  {/* Row 1 */}
                  <div className="mb-4">
                    <div className="shadow-lg rounded-2xl p-4 bg-gray-900 w-full">
                      <h2 className="p-4 text-5xl text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet font-bebas tracking-wider">
                        Disclaimer
                      </h2>
                      <p className="px-4 pb-4 text-white">
                        Please Make Sure You Have More Than &nbsp;
                        <span className="text-xl ">
                          <strong>0.1 MATIC</strong>
                        </span>{" "}
                        &nbsp; in Your Account before Playing.
                      </p>
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="mb-4">
                    <div className="shadow-lg rounded-2xl bg-gray-900 w-full">
                      <p className="font-bebas text-4xl tracking-wider pt-4 pb-2 px-4 text-white">
                        Recent Winner
                      </p>
                      <p className=" text-2xl px-4 pb-2 text-white">
                        Winner of our last lottery round is:
                      </p>
                      <p className="p-4 text-2xl text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet font-bold font-bebas tracking-wide">
                        {recentWinner === ""
                          ? "Let's start the lottery with you!"
                          : `${recentWinner}`}
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

export default Lotter;
