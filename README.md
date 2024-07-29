# Cross Pay

**Connecting Merchants' Preferences with Customers' Choices through Cross-Chain Payments**

## Overview

Cross Pay is an innovative cross-chain payment solution designed to bridge the gap between merchants and customers by providing a seamless, preference-based payment experience. By integrating with multiple blockchain plugins and utilizing the power of the SwapKit API and SDK, ThorSwap, ChainFlip, and MayoChain, Cross Pay ensures a secure, efficient, and versatile payment method for all parties involved.

Created for the DoraHacks CrossChain Summer 2024 hackathon by @kamalbuilds, Cross Pay leverages advanced blockchain technology to deliver a comprehensive payment solution that caters to the needs of both merchants and users.

## Demo URL

## Features

### Simplified Cross-Chain Payments

- **Multi-Blockchain Support**: Allows transactions across different blockchains, ensuring flexibility and convenience for both merchants and customers.
- **User and Merchant Preferences**: Enables users to pay with their preferred cryptocurrency while allowing merchants to receive payments in their desired currency.

### Secure Transactions

- **SwapKit API and SDK Integration**: Utilizes SwapKit's robust API and SDK for secure and efficient transaction processing across multiple blockchains.
- **End-to-End Encryption**: Ensures that all transactions are protected by advanced encryption methods, providing security and peace of mind.

### Plugin Integrations

- **ThorSwap**: Integrates with ThorSwap to facilitate easy swaps and liquidity provision across different blockchain networks.
- **ChainFlip**: Uses ChainFlip's technology to enable seamless cross-chain swaps, ensuring users can transact with their preferred tokens without hassle.
- **MayoChain**: Incorporates MayoChain to leverage its unique features for enhanced transaction speed and reliability.

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
