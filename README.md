Chat-App
Native React mobile application

Description: This chat app was developed using React Native for use on mobile devices, both Android & iOS. The app includes a home screen to enter the chat and a chat interface via Gifted Chat to send messages, images and the user's location.

User Stories: 
* As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family. 
* As a user, I want to be able to send messages to my friends and family members to exchange the latest news. 
* As a user, I want to send images to my friends to show them what I’m currently doing. 
* As a user, I want to share my location with my friends to show them where I am. ● As a user, I want to be able to read my messages offline so I can reread conversations at any time. 
* As a user with a visual impairment, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface.

Key Features: 
* A page where users can enter their name and choose a background color for the chat screen before joining the chat. 
* A page displaying the conversation, as well as an input field and submit button. 
* The chat must provide users with two additional communication features: sending images and location data. 
* Data gets stored online and offline.

How to run & use this project: Expo
* Install Expo via terminal and the Expo app on your mobile device: npm install expo-cli -g
* Node 16.0.0 version worked for me to run expo-cli
* Install all dependencies (see package.json) and start the app: expo start
* Launch Expo app on smartphone and scan the QR code in terminal or Expo window pop-up to open project app
Also: can launch app to test with Android emulator or web browser within Metro Bundler Firebase. This app uses Google Firebase (version 7) for data storage to store messages and images.
* Sign in to firebase.google.com to start & "create a project" - start in 'test mode'
* Create a collection, named "messages", and generate random Document IDs
* Install Firestore via Firebase in project: npm install firebase 7.24.0 
* Link Firebase storage to your project app via GitHub in Project Settings
* Import Firebase into Chat.js file and initialize app with config and Reference your 'messages' collection in Chat.js
￼

Gifted Chat & Custom Actions Includes:
* Sending text chat messages that upload to Firebase database
* Customizing background color and name for the user
* Customizing the chat bubble colors and service messages in Start.js and Chat.js files
* Creating a CustomActions.js file that uses the ActionSheet to allow user to send their location, an image from their library, and/or take a photo to send in that chat. Images are then uploaded to the Firebase storage images folder
* Import ImagePicker and Location from Expo for CustomActions component: import * as ImagePicker from 'expo-image-picker'; import * as Location from 'expo-location';
* Create a '+' button (TouchableOpacity) that users press to view CustomAction options via onActionPress function that is imported and executed in Chat.js render

