import React, { useState, useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Wallet() {
  const { user, setUser } = useStateContext();
  const [wallet, setWallet] = useState({ amount: 0 }); // Initialize wallet as an object with amount property
  const [transactions, setTransactions] = useState([]); // Initialize transactions as an array
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchWalletData = async () => {
    if (location.state.stId) {
      try {
        const { data } = await axiosClient.get("/transaction", {
          params: {
            id: location.state.stId,
          },
        });
        setWallet(data.wallet); // Set the entire wallet object
        setTransactions(data.transactions); // Set transactions as an array
        console.log("Wallet Data:", data);
      } catch (error) {
        console.error("Error fetching wallet data", error);
        setError("Failed to fetch wallet data");
      }
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [location.state.stId]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleContinueClick = async () => {
    const amountToAdd = parseFloat(inputValue);

    setLoading(true);
    setError(null);

    if (!user || !user.id) {
      setError("User not found");
      setLoading(false);
      return;
    }

    console.log("User ID:", user.id); // Debug statement

    try {
      const response = await axiosClient.post("/transaction", {
        user_id: location.state.stId,
        amount: amountToAdd,
        transaction_type: "deposit",
        from_user_id: user.id,
        to_user_id: location.state.stId,
        transaction_medium: "manual",
      });

      if (response.status === 200) {
        // Fetch the updated wallet amount and transactions after the POST request is successful
        await fetchWalletData();
        setInputValue(""); // Clear the input field
      } else {
        throw new Error("Failed to update wallet balance.");
      }
    } catch (error) {
      console.error("Error updating wallet balance", error);
      setError("Failed to update wallet balance");
    } finally {
      setLoading(false);
    }
  };

  console.log(location.state);
  console.log(wallet);

  return (
    <div className="flex w-full">
      <div className="flex-grow m-2">
        <div className="flex space-x-4 mb-2">
          {location.state.stName && (
            <div className="bg-white left-2 w-fit p-6 rounded-lg shadow-md">
              <h4 className="text-3xl font-bold text-gray-600">
                ID : {location.state.stId}
              </h4>
              <h1 className="text-3xl font-bold text-gray-600">
                {location.state.stName}
              </h1>
              <p className="text-blue-500">Wallet of Ammar Student</p>
            </div>
          )}

          {wallet && (
            <div className="bg-white w-fit p-6 rounded-lg shadow-md">
              <div>
                <h1 className="text-3xl font-bold text-blue-500">
                  ${wallet.amount}
                </h1>
                <p className="text-blue-500">Current ProStop Wallet Balance</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto mb-8">
          <h2 className="text-lg font-bold mb-2">Add Money to your Wallet</h2>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter Amount to be Added in Wallet"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={handleContinueClick}
            className="bg-blue-500 text-white py-2 px-4 w-full rounded-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Continue"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            All Transaction Details
          </h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Transaction Type</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Date of transaction</th>
                <th className="py-2 px-4 text-left">Medium</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr className="border-t" key={transaction.id}>
                  <td className="py-4 px-4">{transaction.transaction_type}</td>
                  <td className="py-4 px-4">${transaction.amount}</td>
                  <td className="py-4 px-4">{transaction.date_issured}</td>
                  <td className="py-4 px-4">
                    {transaction.transaction_medium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
