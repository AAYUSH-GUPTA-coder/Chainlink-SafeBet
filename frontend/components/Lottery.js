import Footer from "./Footer";
import Navbar from "./Navbar";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

export default function Lottery(props) {
    const { entryFee } = props;

    const injected = new InjectedConnector({
        supportedChainIds: [80001],
    });

    const {
        active,
        activate,
        deactivate,
        account,
        connector,
        library,
        chainId,
    } = useWeb3React();

    const connectWallet = async () => {
        if (chainId !== 80001) {
            window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x13881",
                        rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                        chainName: "Mumbai Testnet",
                        nativeCurrency: {
                            name: "MATIC",
                            symbol: "MATIC",
                            decimals: 18,
                        },
                        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                    },
                ],
            });
            await activate(injected);
        }
    };

    const disconnectWallet = () => {
        deactivate(injected);
    };

    const renderButton = () => {
        if (!active) {
            return (
                <button
                    className='font-bold text-white bg-secondary-color shadow-md shadow-glow border-0 py-3 px-24 focus:outline-none rounded text-lg transition-all duration-500 ease-in-out hover:scale-90'
                    onClick={connectWallet}
                >
                    Connect Wallet
                </button>
            );
        }

        if (active) {
            return (
                <button
                    className='font-bold text-white border-secondary-color border-2  py-3 px-24 focus:outline-none rounded text-lg transition-all duration-500 ease-in-out '
                    onClick={disconnectWallet}
                >
                    Wallet Connected!
                </button>
            );
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-between w-full'>
            <Navbar
                option1='Crypto Bet'
                link1='/Dashboard/Bet'
                option2='Lottery Game'
                link2='/Dashboard/Lottery'
                option3='Dashboard'
                link3='/Dashboard'
                page='Crypto Bet'
            />
            <div className='pattern w-full h-screen flex justify-center items-center flex-col'>
                <h1 className='xl:text-8xl text-6xl mb-4 font-medium text-white text-center w-full'>
                    <span className='font-bebas text-white'>Welcome to</span>{" "}
                    <span className='font-bebas text-transparent bg-clip-text bg-gradient-to-b from-pink-700 to-sf-violet'>
                        SafeBet
                    </span>
                </h1>

                {renderButton()}
                {active && (
                    <div className='mt-12 flex justify-center items-center w-full'>
                        <button className='border-2 border-secondary-color p-4 rounded-full mx-8 transition-all duration-500 ease-in-out hover:scale-90'>
                            <svg
                                width='30px'
                                height='30px'
                                viewBox='0 0 30 30'
                                id='_24_-_Up'
                                data-name='24 - Up'
                                fill='#E8219A'
                                xmlns='http://www.w3.org/2000/svg'
                            >
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
                        <h2 className='text-white text-5xl font-bold'>
                            Entry Fee: {entryFee}
                        </h2>
                        <button className='border-2 border-secondary-color p-4 rounded-full mx-8 transition-all duration-500 ease-in-out hover:scale-90'>
                            <svg
                                width='30px'
                                height='30px'
                                viewBox='0 0 30 30'
                                id='_22_-_Down'
                                fill='#E8219A'
                                data-name='22 - Down'
                                xmlns='http://www.w3.org/2000/svg'
                            >
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
                )}
                <i>
                    <p className='text-white mt-8 text-xl text-center px-4'>
                        <strong>Disclaimer: </strong>You need at least 0.1 MATIC
                        to play
                    </p>
                </i>
            </div>
            <Footer />
        </div>
    );
}
