# Cross Pay Merchants Pay

**Connecting Merchants' Preferences with Customers' Choices through Cross-Chain Payments**

## Overview

Merchants Pay is an innovative cross-chain payment solution designed to bridge the gap between merchants and customers by providing a seamless, preference-based payment experience. By integrating with multiple blockchain plugins and utilizing the power of the SwapKit API and SDK, ThorSwap, ChainFlip, and MayoChain, Cross Pay ensures a secure, efficient, and versatile payment method for all parties involved.

Merchants Pay leverages advanced blockchain technology to deliver a comprehensive payment solution that caters to the needs of both merchants and users.


## Contract Deployments via create2  

Base Sepolia - https://base-sepolia.blockscout.com/address/0x28d0F2353af7e357Eed9f960D1D2213Fa85a270e

Rollup deployed via Conduit - https://explorer-paytomerchants-co4xglkw0h.t.conduit.xyz/address/0x2AAC535db31DB35D13AECe36Ea7954A2089D55bE

Mode Testnet - https://sepolia.explorer.mode.network/address/0xc8E2B6AC668AC47ffE8814E86aDCb966C6AA3d5b

OP Sepolia Testnet - https://optimism-sepolia.blockscout.com/address/0x2AAC535db31DB35D13AECe36Ea7954A2089D55bE

Fraxtal Testnet - https://holesky.fraxscan.com/address/0x301Ab38c7f652FA23C7Ba1fa182E36665Dac0fC2

## Features

### Simplified Cross-Chain Payments

- **Multi-Blockchain Support**: Allows transactions across different blockchains, ensuring flexibility and convenience for both merchants and customers.
- **User and Merchant Preferences**: Enables users to pay with their preferred cryptocurrency while allowing merchants to receive payments in their desired currency.

### Secure Transactions

- **SwapKit API and SDK Integration**: Utilizes SwapKit's robust API and SDK for secure and efficient transaction processing across multiple blockchains.
- **End-to-End Encryption**: Ensures that all transactions are protected by advanced encryption methods, providing security and peace of mind.

### Partner Integrations

- **Innovative Use of Pyth Price Feeds**: 

- Real-Time Data Integration for Secure Payments: In our project, Merchant's Pay, we utilize Pyth's real-time price feeds to ensure that cross-chain payments are accurately and fairly valued at the moment of the transaction. By integrating Pyth’s pull oracle, we can fetch low-latency price data that allows merchants to receive payments in their preferred currency, with confidence that the conversion rates are up-to-date and accurate. This is critical in a volatile market, where real-time data directly impacts the fairness and security of financial transactions.

- Enhancing Trust in Onchain Commerce: By pulling and consuming Pyth price feeds, we enhance the transparency and trustworthiness of our payment platform. Users and merchants can verify that the price used for each transaction reflects the current market value, minimizing discrepancies and disputes. This use of Pyth not only powers our dapp but also establishes a higher standard for accuracy and reliability in onchain commerce.

Why Our Integration Stands Out:
- Leveraging Pyth for Real-World Impact: We have built our payment platform with the end user in mind, ensuring that Pyth’s technology enhances the overall user experience. By accurately pricing transactions and adding security through randomness, we are addressing real-world challenges in onchain commerce, such as price volatility and transaction.

### Non-Transferable ERC721 Tokens

- **User Pointers**: Associates unique pointers with each user, stored on-chain using non-transferable ERC721 tokens.
- **Immutable Metadata**: Tokens represent user-specific data pointers, ensuring data integrity and consistency across the platform.

### User-Friendly Interface

- **Intuitive Dashboard**: Provides a user-friendly interface for both merchants and customers to manage their transactions effortlessly.
- **Real-Time Notifications**: Keeps users informed about the status of their transactions with real-time updates and notifications.

## How It Works

1. **User Initiates Payment**: The customer selects their preferred cryptocurrency for payment.
2. **Payment Processing**: Cross Pay processes the payment through the SwapKit API and SDK, ensuring secure and efficient handling of the transaction.
3. **Cross-Chain Swap**: If necessary, the payment is swapped using ThorSwap or ChainFlip to match the merchant's preferred currency.
4. **Merchant Receives Payment**: The merchant receives the payment in their desired cryptocurrency, facilitated by MayoChain's reliable transaction network.

## Smart Contract Details

The core functionality of Cross Pay is implemented in a smart contract deployed on the Ethereum blockchain. Key features include:

- **Non-Transferable ERC721 Tokens**: Each user is assigned a non-transferable ERC721 token representing their unique pointer.
- **Role-Based Access Control**: Admin roles are established to manage key functions, such as setting base URIs and batch updating pointers.
- **Secure and Non-Reentrant Functions**: Functions are protected against reentrancy attacks, ensuring secure and reliable operations.

### Contract Structure

- **setPointer**: Allows users to set their unique pointer, minting a non-transferable token if one doesn't already exist.
- **getPointer**: Retrieves the pointer associated with a user.
- **setBaseURI**: Admin function to set the base URI for token metadata.
- **batchSetPointers**: Admin function to batch update pointers for multiple users.

## Getting Started

### Prerequisites

- Node.js and npm installed
- API keys for SwapKit, ThorSwap, ChainFlip, and MayoChain

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/0xsksingh/pay-merchants-crosschain.git
   cd pay-merchants-crosschain
   ```
2. Install dependencies:
   ```sh
   npm install
   ```


### Running the Application

Start the application with:
```sh
npm start
```

## Contribution

We welcome contributions to improve Cross Pay! Please follow the standard GitHub process of forking the repository, creating a new branch, and submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

By integrating cutting-edge blockchain technologies and prioritizing user and merchant preferences, Cross Pay aims to revolutionize the way cross-chain payments are made. Join us in creating a seamless and secure payment experience for all!
