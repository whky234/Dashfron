// src/hooks/Handlemessage.ts
import { useEffect } from "react";
import { AppDispatch } from "../stores/store";
import { PayloadAction } from "@reduxjs/toolkit";

interface HandleMessagesProps {
  message?: string | null;
  error?: string | null;
  clearMessageAction: () => PayloadAction<undefined>;
  setSnackBar: React.Dispatch<
    React.SetStateAction<{ message: string; severity: "success" | "error" } | null>
  >;
  dispatch: AppDispatch;
}

const Handlemessages = ({
  message,
  error,
  clearMessageAction,
  setSnackBar,
  dispatch,
}: HandleMessagesProps) => {
  useEffect(() => {
    if (message) {
      setSnackBar({ message, severity: "success" });
      dispatch(clearMessageAction());
    } else if (error) {
      setSnackBar({ message: error, severity: "error" });
      dispatch(clearMessageAction());
    }
  }, [message, error, dispatch, clearMessageAction, setSnackBar]);
};

export default Handlemessages;
