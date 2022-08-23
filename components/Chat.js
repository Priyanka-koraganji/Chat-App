import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Button, FlatList } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import CustomAction from './customActions';
import MapView from 'react-native-maps';

//import firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
                image: null,
                location: null,
            },
            isConnected: false,
        };
        //config keys
        const firebaseConfig = {
            apiKey: "AIzaSyBQF4hVb36u56Q--Usb76HliDu3zD3YIxU",
            authDomain: "chatapp-b91f5.firebaseapp.com",
            projectId: "chatapp-b91f5",
            storageBucket: "chatapp-b91f5.appspot.com",
            messagingSenderId: "132737882655",
            appId: "1:132737882655:web:9a26378385be748f84132a",
            measurementId: "G-D61GNPCPCK"
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.referenceChatMessages = firebase.firestore().collection('messages');
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt?.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar || '',
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages,
        });
    }
    // firebase storage
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    // temporarly storage of messages (storage)
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {
        // Set name as title chat
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        // Check if user is offline or online
        NetInfo.fetch().then((connection) => {
            if (connection.isConnected) {
                this.setState({
                    isConnected: true,
                });

                // Reference to load messages from Firebase
                this.referenceChatMessages = firebase
                    .firestore()
                    .collection('messages');

                // Authenticate user anonymously
                this.authUnsubscribe = firebase
                    .auth()
                    .onAuthStateChanged(async (user) => {
                        if (!user) {
                            firebase.auth().signInAnonymously();
                        }
                        this.setState({
                            uid: user.uid,
                            messages: [],
                            user: {
                                _id: user.uid,
                                name: name,
                            },
                        });
                        this.unsubscribe = this.referenceChatMessages
                            .orderBy('createdAt', 'desc')
                            .onSnapshot(this.onCollectionUpdate);
                    });
            } else {
                this.setState({
                    isConnected: false,
                });
                this.getMessages();
            }
        });
    }
    // stop listening to auth and collection changes
    componentWillUnmount() {
        if (this.isConnected) {
            this.unsubscribe();
            this.authUnsubscribe();
        }
    }

    onSend(messages = []) {
        this.setState(
            (previousState) => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                // Save messages locally with Async Storage
                this.saveMessages();
                // Call addMessage with last message in message state
                if (this.state.isConnected === true) {
                    this.addMessages(this.state.messages[0]);
                }
            }
        );
    }

    // Add message to Firestore
    addMessages = (message) => {
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: message.user,
            image: message.image || null,
            location: message.location || null,
        });
    };



    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#fafafa',
                    },
                    right: {
                        backgroundColor: '#2d7ecf',
                    },
                }}
            />
        )
    }
    // When user is offline disable sending new messages 
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }
    renderCustomActions = (props) => {
        return <CustomAction {...props} />;
    };


    //Render the map location
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }
    render() {
        let name = this.props.route.params.name;
        const { color } = this.props.route.params;
        if (color === '') {
            color = '#8A95A5';
        }
        return (
            <View style={[{ flex: 1 }, { backgroundColor: color }]}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.user._id,
                        name: name
                    }}
                />

                {
                    Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                }
            </View>
        )

    }
}