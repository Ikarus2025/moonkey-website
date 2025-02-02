import React, { useState, useEffect } from "react";

export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [bnbAmount, setBnbAmount] = useState("");
    const [mnkyAmount, setMnkyAmount] = useState(0);
    const [bnbPrice, setBnbPrice] = useState(0);
    const mnkyPriceInEUR = 0.005; // MNKY soll immer 0.005 EUR kosten

    // Countdown Timer - Release am 15. März 2025
    const releaseDate = new Date("2025-03-15T00:00:00").getTime();
    const [timeLeft, setTimeLeft] = useState(releaseDate - new Date().getTime());

    // API für aktuellen BNB-Preis abrufen
    useEffect(() => {
        const fetchBnbPrice = async () => {
            try {
                const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=eur&precision=4");
                const data = await response.json();
                setBnbPrice(parseFloat(data.binancecoin.eur)); // Konvertiere zu Float für exakte Berechnung
            } catch (error) {
                console.error("Fehler beim Abrufen des BNB-Preises:", error);
            }
        };

        fetchBnbPrice();
        const interval = setInterval(fetchBnbPrice, 30000); // Preis alle 30 Sekunden aktualisieren

        return () => clearInterval(interval);
    }, []);

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
    if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to continue.");
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });

        const accounts = await provider.send("eth_requestAccounts", []);
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



    const handleBnbChange = (e) => {
        const value = e.target.value;
        setBnbAmount(value);
        if (bnbPrice > 0) {
            const mnkyPriceInBNB = mnkyPriceInEUR / bnbPrice; // Dynamische Umrechnung
            setMnkyAmount(value / mnkyPriceInBNB);
        }
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
            <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold text-yellow-300">📅 Token Release Countdown</h2>
                <p className="text-4xl font-bold text-white mt-2">{formatTime(timeLeft)}</p>
            </div>

            {/* Wallet-Verbindung */}
            {!walletConnected ? (
                <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full text-lg"
                        onClick={connectWallet}>
                    Verbinde Wallet
                </button>
            ) : (
                <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg">
                    <p className="text-green-400 font-bold">✅ Wallet verbunden: {walletAddress}</p>
                    <p className="text-gray-400 mt-2">Aktueller BNB-Preis: <span className="text-white font-bold">{bnbPrice.toFixed(2)} EUR</span></p>
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
        </div>
    );
}

