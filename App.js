import { useContext, useEffect } from "react";
import { Router } from "react-chrome-extension-router";
import { getWalletData } from "../background/wallet";
import AppPlug from "./components/AppPlug/AppPlug";
import Header from "./components/Header/Header";
import TokensTabs from "./components/TokensTabs/TokensTabs";
import Loader from "./components/UI/Loader/Loader";
import Wallet from "./components/Wallet/Wallet";
import { fetchBackground } from "./utils/utils";
import {
  updateWalletConnected,
  updateWalletData,
  updatePriceData,
  updateLoading,
} from "./store/actions";
import { Store } from "./store/store-reducer";
import "./styles/App.scss";

function App() {
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    const checkConnection = async () => {
      // eslint-disable-next-line no-undef
      if (!chrome?.runtime?.sendMessage) return;

      const balanceData = await fetchBackground({ method: 'GET_WALLET_BALANCE' });
      updateWalletConnected(dispatch, !!balanceData.data);
    };

    const getWalletData = async () => {
      // eslint-disable-next-line no-undef
      if (!chrome?.runtime?.sendMessage) return;
      const walletData = await fetchBackground({ method: 'GET_WALLET_DATA' });

      if (!walletData.data) return;

      const { address, alias, balance, transactions, assets } = walletData.data;

      updateWalletData(dispatch, {
        address,
        alias,
        balance,
        assets,
        transactions,
      });

      console.log("wallet data updated");
      updateLoading(dispatch, false);

    };

    const intervalId = setInterval(async () => {
      await checkConnection();
      console.log("connected", state.isConnected);
      if (state.isConnected) {
        await getWalletData();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [dispatch, state.isConnected]);

  return (
    <div className="App">
      <AppPlug />
      {state.isConnected && (
        <>
          <Header />
          <Loader />
          <div className="container">
            <Router>
              <Wallet />
              <TokensTabs />
            </Router>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
