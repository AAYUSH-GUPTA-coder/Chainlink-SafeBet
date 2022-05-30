import React from "react";
import Betting from "../../components/Betting";
import { useRef, useState, useEffect } from "react";
import { Contract, providers, utils } from "ethers";
import Web3Modal from "web3modal";
import { CRYPTO_BET_CONTRACT_ADDRESS, bet_abi } from "../../constants";
import { useWeb3React } from "@web3-react/core";
import CryptoBet from "../../components/CryptoBet";

const Bet = () => {

    return (
        <main className='bg-gradient-to-br from-tertiary-color via-main to-tertiary-color'>
			<CryptoBet />
		</main>
    );
};

export default Bet;
