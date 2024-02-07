# Airtime API Kenya [Safaricom, Airtel, Telkom, Faiba networks]

This is a Lightweight Airtime Purchase API for Kenya that is built with Node.js, Express and docker.

Airtime API is supported by Wezadata. The goal is to create a general-purpose, Kenya resell airtime API for vendors to sell airtime and earn commissions.

## Using Airtime API

This application provides an integration between a Node.js API and a legacy PHP container for encryption. 
The Node.js API interacts with the legacy PHP container for encryption purposes and responds to the caller with the results of the Airtime API request.

## Components:
Node.js API (npm)
A Node.js API service responsible for handling incoming requests and interacting with the legacy PHP container for encryption.
Exposes endpoints to facilitate communication with the legacy PHP container and the Airtime API.
Runs on port 3001 internally.

Legacy PHP Container (pesapoint-php)
A PHP container used for encryption, accessed by the Node.js API service.
Provides encryption functionality required for processing Airtime API requests.
Located within the internal Docker network.

Encryption NGINX (encryptnginx)
NGINX server for serving the encryption-related PHP files.
Ensures proper routing and communication between the Node.js API and the PHP container.
Exposed externally on port 8087.

MongoDB and MongoDB Express (mongo, mongo-express)
MongoDB database and MongoDB Express web-based administrative interface for data storage and management.
Configured to run on the internal Docker network.
MongoDB accessible at mongodb://root:example@mongo:27017/.

Setup
Ensure Docker is installed on your system.
Clone the repository containing the Docker configuration and application code.

Build and Run
Navigate to the project directory.
Execute docker-compose up --build to build and start the Docker containers.

Accessing Services
The Node.js API service is accessible at http://localhost:3001.

Interacting with the API
Utilize the provided endpoints of the Node.js API to interact with the Airtime API and encryption functionalities.
Refer to the API documentation for details on available endpoints and usage.

Note
Ensure proper network configuration to enable communication between Docker containers.
Customize ports and configurations as needed for your environment.
For security reasons, ensure that sensitive information such as passwords and API keys are managed securely.
Continuous monitoring and maintenance of the Docker environment are recommended for optimal performance.

Enjoy seamless integration with the Airtime API using this robust Node.js and PHP encryption solution! 🚀


