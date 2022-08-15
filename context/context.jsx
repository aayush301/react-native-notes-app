import { createContext, useContext, useEffect, useState } from "react";
import { getData } from "../utils/storage";
import React from 'react'

const GlobalContext = createContext();
export const GlobalContextProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await getData("notes");
      if (notes) setNotes(notes);
    }
    fetchNotes();
  }, []);

  return <GlobalContext.Provider value={{ notes, setNotes }}>{children}</GlobalContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(GlobalContext);
}