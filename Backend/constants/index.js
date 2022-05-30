const { ethers } = require("hardhat");

const FEE = ethers.utils.parseEther("1");
const INTERVAL = 3600; // for production
// const INTERVAL = 60; // for testing

module.exports = { INTERVAL, FEE };
