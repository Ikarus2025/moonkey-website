import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [bnbAmount, setBnbAmount] = useState("");
    const [mnkyAmount, setMnkyAmount] = useState(0);
    const tokenPrice = 200; // 1 BNB = 200,000 MNKY (Presale Preis: 0.005 pro MNKY)
    
    // Countdown Timer - Release am 15. März 2025
    const releaseDate = new Date("2025-03-15T00:00:00").getTime();
    const [timeLeft, setTimeLeft] = useState(releaseDate - new Date().getTime());

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            setWalletConnected(true);
        }

        const interval = setInterval(() => {
            setTimeLeft(releaseDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum === "undefined") return alert("Bitte installiere MetaMask.");
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setWalletConnected(true);
            setWalletAddress(accounts[0]);
        } catch (error) {
            console.error("Wallet Verbindung fehlgeschlagen:", error);
        }
    };

    const handleBnbChange = (e) => {
        const value = e.target.value;
        setBnbAmount(value);
        setMnkyAmount(value / 0.005); // 1 MNKY kostet 0.005 BNB
    };

    // Funktion zur Formatierung des Countdowns
    const formatTime = (time) => {
        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
            {/* Presale Header */}
            <h1 className="text-5xl font-bold text-yellow-400">🚀 MOONKEY PRESALE 🚀</h1>
            <p className="text-lg mt-4 text-gray-300">Sichere dir jetzt $MNKY Tokens vor dem Launch!</p>

            {/* Countdown Timer */}
            <div className="mt-6 bg-gray-800 p-4 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-yellow-300">📅 Token Release Countdown</h2>
                <p className="text-3xl font-bold text-white mt-2">{formatTime(timeLeft)}</p>
            </div>

            {/* Wallet-Verbindung */}
            {!walletConnected ? (
                <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full text-lg"
                        onClick={connectWallet}>
                    Verbinde Wallet
                </button>
            ) : (
                <div className="mt-6 bg-gray-800 p-4 rounded-xl shadow-lg">
                    <p className="text-green-400 font-bold">✅ Wallet verbunden: {walletAddress}</p>
                    <input
                        type="number"
                        placeholder="BNB eingeben"
                        className="mt-4 p-3 text-black rounded w-full"
                        value={bnbAmount}
                        onChange={handleBnbChange}
                    />
                    <p className="mt-2 text-yellow-400 font-bold">Du erhältst: {mnkyAmount.toFixed(2)} MNKY</p>
                    <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">
                        Jetzt kaufen
                    </button>
                </div>
            )}

            {/* Tokenomics */}
            <div className="mt-12 w-full max-w-3xl text-center">
                <h2 className="text-3xl font-bold text-yellow-300">📊 Tokenomics</h2>
                <p className="text-gray-400 mt-2">Total Supply: <span className="text-white font-bold">1,000,000,000 MNKY</span></p>
                <p className="text-gray-400">Presale: <span className="text-white font-bold">40%</span></p>
                <p className="text-gray-400">Liquidity: <span className="text-white font-bold">30%</span></p>
                <p className="text-gray-400">Team: <span className="text-white font-bold">15%</span></p>
                <p className="text-gray-400">Marketing & Entwicklung: <span className="text-white font-bold">15%</span></p>
            </div>

            {/* Roadmap */}
            <div className="mt-12 w-full max-w-3xl text-center">
                <h2 className="text-3xl font-bold text-yellow-300">🚀 Roadmap</h2>
                <ul className="text-gray-400 mt-4 space-y-2">
                    <li>✅ Q1 2024: Projektstart & Website Launch</li>
                    <li>🚀 Q2 2024: Presale & Community-Building</li>
                    <li>🔥 Q3 2024: Listing auf dezentralen Börsen</li>
                    <li>🌕 Q4 2024: Expansion & Partnerschaften</li>
                </ul>
            </div>
        </div>
    );
}

