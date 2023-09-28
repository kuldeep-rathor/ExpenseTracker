import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc, updateDoc } from "firebase/firestore"; // Import necessary Firebase Firestore functions
import { db } from "../../config/firebase-config";

import "./styles.css";
import { auth } from "../../config/firebase-config";

export const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionTotals } = useGetTransactions();
  const { name, profilePhoto } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const { balance, income, expenses } = transactionTotals;

  const onSubmit = (e) => {
    e.preventDefault();

    if (isEditing && editingTransaction) {
      // If in editing mode, update the transaction
      handleUpdateTransaction();
    } else {
      // Otherwise, add a new transaction
      addTransaction({
        description,
        transactionAmount,
        transactionType,
      });
    }

    // Reset form fields
    setDescription("");
    setTransactionAmount(0);
    setTransactionType("expense");
    setIsEditing(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction) => {
    // Set the editing state to true and populate the edit form
    setIsEditing(true);
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setTransactionAmount(transaction.transactionAmount);
    setTransactionType(transaction.transactionType);
  };

  const handleUpdateTransaction = async () => {
    try {
      // Update the transaction in Firebase
      const transactionRef = doc(db, "transactions", editingTransaction.id);
      await updateDoc(transactionRef, {
        description,
        transactionAmount,
        transactionType,
      });

      // Update the transaction in local storage (optional)
      const updatedTransactions = transactions.map((transaction) => {
        if (transaction.id === editingTransaction.id) {
          return {
            ...transaction,
            description,
            transactionAmount,
            transactionType,
          };
        }
        return transaction;
      });
      localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

      // Reset form fields and editing state
      setDescription("");
      setTransactionAmount(0);
      setTransactionType("expense");
      setIsEditing(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Remove the transaction from Firebase
      await deleteDoc(doc(db, "transactions", id));

      // Remove the transaction from local storage (optional)
      const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
      localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

      // Update the state to reflect the removal
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="expense-tracker">
        <div className="container">
          <h1>{name}'s Expense Tracker</h1>
          <div className="balance">
            <h3>Your Balance</h3>
            {balance >= 0 ? <h2>${balance}</h2> : <h2>-${balance * -1}</h2>}
          </div>
          <div className="summary">
            <div className="income">
              <h4>Income</h4>
              <p>${income}</p>
            </div>
            <div className="expenses">
              <h4>Expenses</h4>
              <p>${expenses}</p>
            </div>
          </div>
          <form className="add-transaction" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transactionAmount}
              required
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            <input
              type="radio"
              id="expense"
              value="expense"
              checked={transactionType === "expense"}
              onChange={(e) => setTransactionType(e.target.value)}
            />
            <label htmlFor="expense">Expense</label>
            <input
              type="radio"
              id="income"
              value="income"
              checked={transactionType === "income"}
              onChange={(e) => setTransactionType(e.target.value)}
            />
            <label htmlFor="income">Income</label>

            <button type="submit">
              {isEditing ? "Update Transaction" : "Add Transaction"}
            </button>
          </form>
        </div>
        {profilePhoto && (
          <div className="profile">
            <img className="profile-photo" src={profilePhoto} alt="Profile" />
            <button className="sign-out-button" onClick={signUserOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
      <div className="transactions">
        <h3>Transactions</h3>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <h4>{transaction.description}</h4>
              <p>
                ${transaction.transactionAmount} • {transaction.transactionType}
              </p>
              <button onClick={() => handleEdit(transaction)}>Edit</button>
              <button onClick={() => handleDelete(transaction.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
