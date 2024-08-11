// @ts-nocheck
import React, { use, useState } from 'react';
import { ethers } from 'ethers';
import { siteConfig } from '@/config/site';
import { useChainId } from 'wagmi';
import { crosspayABI } from '@/abi/crosspayABI';

const PriceFeeds = () => {
  const [selectedPriceIds, setSelectedPriceIds] = useState([]);
  const [prices, setPrices] = useState([]);

  const connectedchainid = useChainId();

  const PYTH_CONTRACT_ADDRESS = siteConfig.crosspayaddress[connectedchainid];

  const priceFeedIds = [
    { id: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', symbol: 'ETH/USD' },
    { id: '0x7b5f7d5d8c6c7f5c5d5c7b5f7d5d8c6c7f5c5d5c7b5f7d5d8c6c7f5c5d5c7b5f7', symbol: 'BTC/USD' },
    { id: '0x7b5f7d5d8c6c7f5c5d5c7b5f7d5d8c6c7f5c5d5c7b5f7d5d8c6c7f5c5d5c7b5f8', symbol: 'USDC/USD' },
    { id: '0x7b5f7d5d8c6c7f5c5d5c7b5f7d5d8c6c7f5c5d5c7b5f7d5d8c6c7f5c5d5c7b5f9', symbol: 'USDT/USD' },
  ];

  const fetchPriceFeeds = async () => {
    try {
      const provider = new ethers.BrowserProvider(window?.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(PYTH_CONTRACT_ADDRESS, crosspayABI, signer);

      const priceUpdates = selectedPriceIds.map((id) => ethers.hexlify(id));
      const prices = await contract.getPrices(priceUpdates);

      setPrices(prices);
    } catch (error) {
      console.error('Error fetching price feeds:', error);
    }
  };

  const handlePriceIdClick = (priceId) => {
    setSelectedPriceIds((prevIds) => {
      if (prevIds.includes(priceId)) {
        return prevIds.filter((id) => id !== priceId);
      } else {
        return [...prevIds, priceId];
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Price Feeds</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {priceFeedIds.map((feed) => (
          <button
            key={feed.id}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedPriceIds.includes(feed.id)
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handlePriceIdClick(feed.id)}
          >
            {feed.symbol}
          </button>
        ))}
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        onClick={fetchPriceFeeds}
      >
        Fetch Price Feeds
      </button>

      {prices.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Price Feeds:</h2>
          <ul className="space-y-2">
            {prices.map((price, index) => (
              <li key={index}>
                <strong>Price ID:</strong> {priceFeedIds[index].symbol} - {price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PriceFeeds;