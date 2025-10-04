import React, { useState, useEffect } from "react";

const MetamaskLogin = ({ setUserAddress }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        setUserAddress(accounts[0]);
      } catch (err) {
        console.error("User denied wallet connection");
      }
    } else {
      alert("Please install Metamask!");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
        setUserAddress(accounts[0]);
      });
    }
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      minHeight: "80px"
    }}>
      <div style={{
        background: "linear-gradient(90deg, #5f72be 0%, #9b23ea 100%)",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(91,114,190,0.15)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        minWidth: "260px",
        fontFamily: "Inter, Arial, sans-serif"
      }}>
        {account ? (
          <span style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            letterSpacing: "0.5px",
            background: "rgba(91,114,190,0.18)",
            borderRadius: "8px",
            padding: "8px 16px"
          }}>
            <svg width="20" height="20" style={{ verticalAlign: "middle", marginRight: "8px" }} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2"/>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#fff"/>
            </svg>
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            style={{
              background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 28px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(91,114,190,0.15)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(91,114,190,0.25)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(91,114,190,0.15)";
            }}
          >
            <svg width="20" height="20" style={{ verticalAlign: "middle", marginRight: "8px" }} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2"/>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#fff"/>
            </svg>
            Connect Metamask
          </button>
        )}
      </div>
    </div>
  );
};

export default MetamaskLogin;
