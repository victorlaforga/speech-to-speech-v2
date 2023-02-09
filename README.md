# Speech to speech chatbot 
The code is server side. So it is not meant to be used locally. In the node-index.js file you have the possibility to change the port variable. It is now set on 3000. If you change this you need to change the absolute links also in the index.js file. Netlify deployment link will not work so you can run your product locally.

Node versie: 18.12.1
# How to run the project?

This project is designed to be run using npm, a package manager for JavaScript projects. In this README, you will find the steps necessary to run the project on your local machine.

## Prerequisites
Before you start, you need to have npm installed on your machine. You can download and install npm from the official website https://www.npmjs.com/get-npm.

## Installation
1. Clone this repository to your local machine using the following command:
```
git clone https://github.com/victorlaforga/speech-to-speech-v2
```

2. Navigate to the root directory of the cloned repository:

```
cd speech-to-speech-v2
```

3. Install the project dependencies by running the following command:
```
npm install
```

## Running the project


Once the installation is complete, you can start the project by running the following command:
```
export GOOGLE_APPLICATION_CREDENTIALS=careful-airfoil-372120-37289c1605a3.json && npm install && node node-index.js
```

This will launch the project in your default web browser in a specific localhost, check the terminal to see on what localhost.

## Conclusion

With these steps, you should now be able to run the project on your local machine using npm. If you encounter any issues, feel free to raise an issue in the GitHub repository.
