import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";

const SMART_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
const ABI = []; // Hier dein Smart Contract ABI einfügen

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6 relative overflow-hidden">
            {/* Hintergrundanimationen */}
            <div className="absolute inset-0 bg-[url('/images/space-bg.jpg')] bg-cover bg-center opacity-30 animate-pan"></div>
            <div className="absolute inset-0 bg-gradient-radial from-yellow-400/10 to-transparent animate-pulse"></div>
            <div className="absolute inset-0 bg-[url('/images/stars.png')] bg-cover bg-center opacity-50 animate-twinkle"></div>

            {/* Hauptcontainer */}
            <div className="relative z-10 text-center max-w-4xl w-full">
                {/* Titel */}
                <h1 className="text-6xl font-extrabold text-yellow-400 mt-10 animate-float">
                    🚀 MOONKEY PRESALE 🚀
                </h1>
                <p className="text-lg mt-4 text-gray-300 text-center max-w-2xl mx-auto">
                    Get your $MNKY tokens before launch and ride the moon wave! 🌕
                </p>

                {/* Presale-Box */}
                <div className="mt-10 flex flex-col items-center bg-gray-800/75 p-8 rounded-2xl shadow-2xl text-center backdrop-blur-lg border border-yellow-400/20 transform transition-all duration-500 hover:scale-105">
                    <h2 className="text-3xl font-bold text-yellow-300 animate-bounce">
                        🌕 Presale is LIVE!
                    </h2>
                    <p className="text-xl mt-4 text-white">
                        1 MNKY = 0.005 EUR
                    </p>
                    <p className="text-lg text-gray-400 mt-2">
                        Current BNB Price: ${bnbPrice ? bnbPrice.toFixed(2) : "Loading..."}
                    </p>

                    {!walletConnected ? (
                        <button
                            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full text-lg transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
                            onClick={connectWallet}
                        >
                            Connect Wallet
                        </button>
                    ) : (
                        <div className="mt-6 w-full max-w-md">
                            <input
                                type="number"
                                placeholder="Enter BNB amount"
                                className="mt-4 p-3 text-black rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-lg"
                                value={bnbAmount}
                                onChange={handleBnbChange}
                            />
                            <p className="mt-2 text-yellow-400 font-bold">
                                You receive: {mnkyAmount.toFixed(2)} MNKY
                            </p>
                            <button
                                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/50"
                                onClick={buyTokens}
                            >
                                Buy Now
                            </button>
                        </div>
                    )}
                </div>

                {/* Countdown-Timer (optional) */}
                <div className="mt-8 text-yellow-400 text-xl font-bold">
                    ⏳ Presale ends in: 2 days, 14 hours, 23 minutes
                </div>

                {/* Social Media Links (optional) */}
                <div className="mt-8 flex space-x-6 justify-center">
                    <a href="#" className="text-yellow-400 hover:text-yellow-500 transition-all">
                        <i className="fab fa-twitter text-2xl"></i>
                    </a>
                    <a href="#" className="text-yellow-400 hover:text-yellow-500 transition-all">
                        <i className="fab fa-telegram text-2xl"></i>
                    </a>
                    <a href="#" className="text-yellow-400 hover:text-yellow-500 transition-all">
                        <i className="fab fa-discord text-2xl"></i>
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 w-full text-center py-4 text-gray-400">
                &copy; 2023 Moonkey Token. All rights reserved.
            </div>
        </div>
    );
}
