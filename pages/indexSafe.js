import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import { FaTwitter, FaTelegram, FaDiscord } from "react-icons/fa";
import { motion } from "framer-motion";

const SMART_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
const ABI = []; 

export default function MoonkeyPresale() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [bnbAmount, setBnbAmount] = useState("");
    const [mnkyAmount, setMnkyAmount] = useState(0);
    const [bnbPrice, setBnbPrice] = useState(0);
    const tokenPriceEUR = 0.005;

    useEffect(() => {
        const fetchBNBPrice = async () => {
            try {
                const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT");
                const data = await response.json();
                setBnbPrice(parseFloat(data.price));
            } catch (error) {
                console.error("Error fetching BNB price:", error);
            }
        };
        fetchBNBPrice();
        const interval = setInterval(fetchBNBPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum === "undefined") {
            alert("Please install MetaMask to continue.");
            return;
        }
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const network = await provider.getNetwork();
            if (network.chainId !== 56) {
                alert("Please switch to Binance Smart Chain (BSC Mainnet). ");
                return;
            }
            if (accounts.length > 0) {
                setWalletConnected(true);
                setWalletAddress(accounts[0]);
                alert(`Wallet connected: ${accounts[0]}`);
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
            alert("Wallet connection failed! Please try again.");
        }
    };

    const buyTokens = async () => {
        if (!walletConnected) {
            alert("Please connect your wallet first.");
            return;
        }
        if (bnbAmount <= 0) {
            alert("Enter a valid BNB amount.");
            return;
        }
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(SMART_CONTRACT_ADDRESS, ABI, signer);
            const transaction = await contract.buyWithBNB({ value: ethers.utils.parseEther(bnbAmount.toString()) });
            await transaction.wait();
            alert("Purchase successful! MNKY tokens will be distributed after presale.");
        } catch (error) {
            console.error("Purchase failed:", error);
            alert("Transaction failed! Please try again.");
        }
    };

    const handleBnbChange = (e) => {
        const value = e.target.value;
        setBnbAmount(value);
        if (bnbPrice > 0) {
            const mnkyPriceInBNB = tokenPriceEUR / bnbPrice;
            setMnkyAmount(value / mnkyPriceInBNB);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Image src="/moonkey.png" alt="Moonkey Astronaut" width={200} height={200} className="mb-6" />
            </motion.div>
            <h1 className="text-6xl font-extrabold text-yellow-400 mt-10 animate-bounce">🚀 MOONKEY PRESALE 🚀</h1>
            <p className="text-lg mt-4 text-gray-300 text-center max-w-2xl">
                Get your $MNKY tokens before launch and ride the moon wave!
            </p>

            <div className="mt-10 flex flex-col items-center bg-gray-800 p-8 rounded-xl shadow-xl text-center max-w-lg">
                <h2 className="text-3xl font-bold text-yellow-300">🌕 Presale is LIVE!</h2>
                <p className="text-xl mt-4 text-white">1 MNKY = 0.005 EUR</p>
                <p className="text-lg text-gray-400 mt-2">Current BNB Price: ${bnbPrice ? bnbPrice.toFixed(2) : "Loading..."}</p>
                {!walletConnected ? (
                    <motion.button whileHover={{ scale: 1.1 }} className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full text-lg"
                        onClick={connectWallet}>
                        Connect Wallet
                    </motion.button>
                ) : (
                    <div className="mt-6">
                        <input type="number" placeholder="Enter BNB amount" className="mt-4 p-3 text-black rounded w-full"
                               value={bnbAmount} onChange={handleBnbChange} />
                        <p className="mt-2 text-yellow-400 font-bold">You receive: {mnkyAmount.toFixed(2)} MNKY</p>
                        <motion.button whileHover={{ scale: 1.1 }} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
                            onClick={buyTokens}>
                            Buy Now
                        </motion.button>
                    </div>
                )}
            </div>

            <div className="mt-12 flex space-x-6">
                <FaTwitter className="text-4xl text-blue-400 hover:text-blue-600 cursor-pointer" />
                <FaTelegram className="text-4xl text-blue-300 hover:text-blue-500 cursor-pointer" />
                <FaDiscord className="text-4xl text-indigo-400 hover:text-indigo-600 cursor-pointer" />
            </div>
        </motion.div>
    );
}
