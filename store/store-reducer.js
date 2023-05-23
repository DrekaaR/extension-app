import { createContext, useReducer } from "react";

const initialState = {
  displayUsd: true,
  isLoading: true,
  isConnected: true,
  isBalancesHidden: false,
  priceData: { price: 1, change: -4.6 },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "WALLET_ADDRESS_UPDATED":
      return { ...state, walletAddress: action.payload };
    case "WALLET_BALANCE_UPDATED":
      return { ...state, walletBalance: action.payload };
    case "WALLET_CONNECTED_UPDATED":
      return { ...state, isConnected: action.payload };
    case "WALLETS_LIST_UPDATED":
      return { ...state, walletsList: action.payload };
    case "WALLET_DATA_UPDATED":
      return { ...state, wallet: action.payload };
    case "PRICE_DATA_UPDATED":
      return { ...state, priceData: action.payload };
    case "DISPLAY_CURRENCY_UPDATED":
      return { ...state, displayUsd: action.payload };
    case "LOADING_UPDATED":
      return { ...state, isLoading: action.payload };
    case "BALANCES_HIDDEN_UPDATED":
      return { ...state, isBalancesHidden: action.payload };
    default:
      return state;
  }
};

export const Store = createContext(initialState);

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};
