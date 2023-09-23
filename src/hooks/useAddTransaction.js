import React from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";

export const useAddTransaction = () => {
  const transactionCollectionRef = collection(db, "transactions");

  const addTransaction = async () => {
    await addDoc(transactionCollectionRef, {
      userID: "",
      description: "",
      transactionAmount: 0,
      transactionType: "",
      createdAT: "",
    });
  };
  return;
};
