// SPDX-License-Identifier: MIT
/*
@author Aayush Gupta. Twiiter: @Aayush_gupta_ji Github: AAYUSH-GUPTA-coder
 */
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error NOT_ENOUGH_MATIC_IN_CONTRACT();
error FUND_NOT_SEND();
error SEND_EFFICIENT_MATIC();
error FAILED_TO_SEND_ETHER_TO_OWNER();
error BET_UPKEEP_NOT_NEEDED();

contract CryptoBet is KeeperCompatibleInterface {
    AggregatorV3Interface internal priceFeedETH;
    address payable private immutable owner;
    uint256 private immutable entryAmount;
    uint256 private immutable interval;
    uint256 private lastTimeStamp;
    address payable[] private upBetAddresses;
    address payable[] private downBetAddresses;
    uint private lastTimeStampPrice;
    uint256 private marginValue;
    uint256 private winningValueUp;
    uint256 private winningValueDown;
    mapping(address => uint256) private userTotalCash;

    /**
     * Network: Mumbai Testnet
     * Aggregator: ETH / USD
     * Address: 0x0715A7794a1dc8e42615F059dD6e406A6594651A
     */
    constructor(uint256 _updateInterval, uint256 _entryAmount) {
        priceFeedETH = AggregatorV3Interface(
            0x0715A7794a1dc8e42615F059dD6e406A6594651A
        );
        owner = payable(msg.sender);
        // chainlink keepers to update and excute placeBetUPDown function
        // interval after function will execute
        interval = _updateInterval;
        lastTimeStamp = block.timestamp;
        entryAmount = _entryAmount;
    }

    

    // eth/usd = $2,040.62
    //  2,040.52,871,350 / 100000000 = 2040

    /**
     * Returns the latest price
     */
    function getLatestPriceETH() public view returns (int256) {
        (, int256 price, , , ) = priceFeedETH.latestRoundData();
        return price / 100000000;
        //2040
    }

    /* Events */
    event EnterDownBet(address indexed player);
    event EnterUpBet(address indexed player);
    event BetEnter(address indexed player);
    event Winner(string winner);
    event Perform_UpKeep();
    event ExecutePlaceBet(string message);

    //  event Log(address indexed sender, string message);

    // amount should be less than contract_Balance / 2
    modifier notEnoughMaticInContract() {
        if ((entryAmount * 2) >= getBalance()) {
            revert NOT_ENOUGH_MATIC_IN_CONTRACT();
        }
        _;
    }

    // amount of the Matic send be greater or equal to amount specified
    modifier sendEnoughMatic() {
        if (entryAmount >= msg.value) {
            revert SEND_EFFICIENT_MATIC();
        }
        _;
    }

    // function to get last timestamp Price;
    function setLastTimeStampPrice() public {
        lastTimeStampPrice = uint(getLatestPriceETH());
        marginValue = (lastTimeStampPrice * 1) / 1000; // 0.1
        winningValueUp = lastTimeStampPrice + marginValue;
        winningValueDown = lastTimeStampPrice - marginValue;
    }
    

    // function to place Bet for price going Up
    function placeBetUp()
        public
        payable
        notEnoughMaticInContract
        sendEnoughMatic
    {
        upBetAddresses.push(payable(msg.sender));
        setLastTimeStampPrice();
        emit EnterUpBet(msg.sender);
        emit BetEnter(msg.sender);
    }

    // function to place Bet for price going down
    function placeBetDown()
        public
        payable
        notEnoughMaticInContract
        sendEnoughMatic
    {
        downBetAddresses.push(payable(msg.sender));
        setLastTimeStampPrice();
        emit EnterDownBet(msg.sender);
        emit BetEnter(msg.sender);
    }

    // Include a checkUpkeep function that contains the logic that will be executed off-chain to see if performUpkeep should be executed.
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool timePassed = ((block.timestamp - lastTimeStamp) > interval); // keep track of betting
        bool hasPlayers = upBetAddresses.length > 0 ||
            downBetAddresses.length > 0;
        upkeepNeeded = (timePassed && hasPlayers);
        return (upkeepNeeded, "0x0");
    }

    // function to send MATIC to the winners
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        // this is the way to get checkUpKeep function. we only need 1 parameter, therefore (bool upkeepNeede, ) next is blank.
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert BET_UPKEEP_NOT_NEEDED();
        }
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            executePlaceBet();
            lastTimeStamp = block.timestamp;
        }
        emit Perform_UpKeep();
    }

    // placing bet with simple up and down
    function executePlaceBet() private {
        // uint256 price = uint256(getLatestPriceETH());
        uint256 latestPrice = uint256(getLatestPriceETH());

        if (latestPrice >= winningValueUp) {
            sendWinningAmount(upBetAddresses);
            emit Winner("Up");
        }
        else if (latestPrice < winningValueDown) {
            sendWinningAmount(downBetAddresses);
            emit Winner("Down");
        } 
        else{
            emit Winner("None");
        }
        emit ExecutePlaceBet("DONE");
        upBetAddresses = new address payable[](0);
        downBetAddresses = new address payable[](0);
    }

    // sending winning amount to winner
    function sendWinningAmount(address payable[] memory winner) private {
        for (uint256 i = 0; i < winner.length; i++) {
            address payable winneraddr = winner[i];
            (bool sent, ) = (winneraddr).call{value: (entryAmount * 2)}("");
            if (!sent) {
                revert FUND_NOT_SEND();
            }
            // Track which user won how much
            userTotalCash[winneraddr] += entryAmount * 2;
        }
    }

    // withdraw the matic to the owner account
    function withdraw() external {
        uint256 amount = address(this).balance;
        (bool sent, ) = owner.call{value: amount}("");
        if (!sent) {
            revert FAILED_TO_SEND_ETHER_TO_OWNER();
        }
    }

    // GETTER FUNCTION

    // get the contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // length of UP Bettor
    function getLengthOfUpBettors() public view returns (uint256) {
        return upBetAddresses.length;
    }

    // length of Down Bettor
    function getLengthOfDownBettors() public view returns (uint256) {
        return downBetAddresses.length;
    }

    // entry fees
    function getEntranceFee() public view returns (uint256) {
        return entryAmount;
    }

    // get time interval
    function getInterval() public view returns (uint256) {
        return interval;
    }

    // get UP bettor by index
    function getUpBettor(uint256 index) public view returns (address) {
        return upBetAddresses[index];
    }

    // get down bettor by index
    function getDownBettor(uint256 index) public view returns (address) {
        return downBetAddresses[index];
    }

    // get all UP bettor addresses
    function getUpBettor() public view returns (address payable[] memory) {
        return upBetAddresses;
    }

    // get all Down bettor addresses
    function getDownBettor() public view returns (address payable[] memory) {
        return downBetAddresses;
    }

    // get owner of the contract
    function getOwner() public view returns (address) {
        return owner;
    }

    // get lasttimestamp
    function getLastTimeStamp() public view returns (uint256) {
        return lastTimeStamp;
    }

    // get time left to execute performUpkeep
    function getTimeLeft() public view returns (uint256) {
        return ((lastTimeStamp + interval) - block.timestamp);
    }

    // get last timestamp price
    function getLastTimeStampPrice() public view returns(uint256) {
        return lastTimeStampPrice;
    }

    function getTotalCashOfPlayer(address user) public view returns (uint256) {
        return userTotalCash[user];
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
