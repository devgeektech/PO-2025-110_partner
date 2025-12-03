import React, { useEffect, useState } from "react";

export default function PaymentStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("status");
    setStatus(s);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "450px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {status === "success" ? (
        <>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "700",
              marginBottom: "15px",
              color: "#1abc9c",
            }}
          >
            Payment Successful
          </h1>

          <p
            style={{
              fontSize: "18px",
              marginBottom: "25px",
            }}
          >
            Thank you! Your payment was processed successfully.
          </p>
        </>
      ) : status === "failed" ? (
        <>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "700",
              marginBottom: "15px",
              color: "#e74c3c",
            }}
          >
            Payment Failed
          </h1>

          <p
            style={{
              fontSize: "18px",
              marginBottom: "25px",
            }}
          >
            Oops! Something went wrong with your payment.
          </p>
        </>
      ) : (
        <>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "700",
              marginBottom: "15px",
            }}
          >
            Checking Payment Status...
          </h1>
        </>
      )}

      <button
        style={{
          padding: "12px 20px",
          backgroundColor: "#0984e3",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
        }}
        onClick={() => (window.location.href = "/")}
      >
        Go Back Home
      </button>
    </div>
  );
}
