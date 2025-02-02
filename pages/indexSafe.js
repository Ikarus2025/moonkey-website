import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Smart Contract Infos (PLATZHALTER! Ersetze mit deinen Werten)
const SMART_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
const ABI = []; // Hier dein Smart Contract ABI einfügen

export default function IndexSafe() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [bnbAmount, setBnbAmount] = useState("");
    const [mnkyAmount, setMnkyAmount] = useState(0);
    const [bnbPrice, setBnbPrice] = useState(0);
    const tokenPriceEUR = 0.005; // 1 MNKY = 0.005 EUR

    // ✅ Hole BNB-Preis in Echtzeit von Binance API
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

        fetchBNBPrice(); // Direkt abrufen
        const interval = setInterval(fetchBNBPrice, 60000); // Alle 60 Sekunden aktualisieren

        return () => clearInterval(interval);
    }, []);

    // ✅ Wallet-Verbindung
    const connectWallet = async () => {
        if (typeof window.ethereum === "undefined") {
            alert("Please install MetaMask to continue.");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const network = await provider.getNetwork();

            if (network.chainId !== 56) { // 56 = BSC Mainnet
                alert("Please switch to Binance Smart Chain (BSC Mainnet).");
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

    // ✅ Kauf-Button Funktion
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

    // ✅ Berechnung der Tokens basierend auf BNB-Preis
    const handleBnbChange = (e) => {
        const value = e.target.value;
        setBnbAmount(value);

        if (bnbPrice > 0) {
            const mnkyPriceInBNB = tokenPriceEUR / bnbPrice;
            setMnkyAmount(value / mnkyPriceInBNB);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
            {/* Header */}
            <h1 className="text-5xl font-bold text-yellow-400">🚀 MOONKEY PRESALE 🚀</h1>
            <p className="text-lg mt-4 text-gray-300">Secure your $MNKY tokens before the launch!</p>

            {/* Wallet-Verbindung */}
            {!walletConnected ? (
                <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full text-lg"
                        onClick={connectWallet}>
                    Connect Wallet
                </button>
            ) : (
                <div className="mt-6 bg-gray-800 p-4 rounded-xl shadow-lg">
                    <p className="text-green-400 font-bold">✅ Wallet connected: {walletAddress}</p>
                    <input
                        type="number"
                        placeholder="Enter BNB amount"
                        className="mt-4 p-3 text-black rounded w-full"
                        value={bnbAmount}
                        onChange={handleBnbChange}
                    />
                    <p className="mt-2 text-yellow-400 font-bold">You receive: {mnkyAmount.toFixed(2)} MNKY</p>
                    <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
                            onClick={buyTokens}>
                        Buy Now
                    </button>
                </div>
            )}

            {/* BNB Price Display */}
            <div className="mt-6 bg-gray-800 p-4 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-yellow-300">BNB Price (Live)</h2>
                <p className="text-3xl font-bold text-white mt-2">{bnbPrice ? `$${bnbPrice.toFixed(2)}` : "Loading..."}</p>
            </div>

            {/* Tokenomics */}
            <div className="mt-12 w-full max-w-3xl text-center">
                <h2 className="text-3xl font-bold text-yellow-300">📊 Tokenomics</h2>
                <p className="text-gray-400 mt-2">Total Supply: <span className="text-white font-bold">1,000,000,000 MNKY</span></p>
                <p className="text-gray-400">Presale: <span className="text-white font-bold">40%</span></p>
                <p className="text-gray-400">Liquidity: <span className="text-white font-bold">30%</span></p>
                <p className="text-gray-400">Team: <span className="text-white font-bold">15%</span></p>
                <p className="text-gray-400">Marketing & Development: <span className="text-white font-bold">15%</span></p>
            </div>

            {/* Roadmap */}
            <div className="mt-12 w-full max-w-3xl text-center">
                <h2 className="text-3xl font-bold text-yellow-300">🚀 Roadmap</h2>
                <ul className="text-gray-400 mt-4 space-y-2">
                    <li>✅ Q1 2024: Project Launch & Website Live</li>
                    <li>🚀 Q2 2024: Presale & Community Growth</li>
                    <li>🔥 Q3 2024: Exchange Listings</li>
                    <li>🌕 Q4 2024: Expansion & Partnerships</li>
                </ul>
            </div>
        </div>
    );
}
