import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Platform, KeyboardAvoidingView } from 'react-native';

//import firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            uid: 0
        }
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
                createdAt: data.createdAt.toDate(),
                user: data.user,
            });
        });
        this.setState({
            messages,
        });
    }
    componentDidMount() {
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        this.referenceChatMessages = firebase.firestore().collection('messages');
        this.unsubscribeListUser = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);


        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                messages: [],
            });
            this.referenceChatMessageslistUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);
            this.unsubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    componentWillUnmount() {
        this.authUnsubscribe();
        this.unsubscribeListUser();
    }


    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        const newMessage = this.state.messages[0]
        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: newMessage._id,
            text: newMessage.text,
            createdAt: newMessage.createdAt,
            user: newMessage.user
        })
    }
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2d7ecf'
                    }
                }}
            />
        )
    }

    render() {
        let name = this.props.route.params.name;
        let color = this.props.route.params.color;
        if (color === '') {
            color = '#8A95A5';
        }
        return (
            <View style={{ flex: 1, backgroundColor: color }}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                />

                {
                    Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
                }
            </View>
        )

    }
}
