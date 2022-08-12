import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            name: '',
            color: '#090C08'
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/Background-Image.png')} style={styles.image}>
                    <Text style={styles.title}>Chat App</Text>

                    <View style={styles.main}>
                        <TextInput style={[styles.input, styles.smallText]}

                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            placeholder='Type here ...'
                        />

                        <View>
                            <Text style={styles.text}>Choose Background Color</Text>
                            <View style={styles.mainColors}>
                                <TouchableOpacity style={[styles.colors, styles.color1]} onPress={() => { this.setState({ color: ' #090C08' }) }} />
                                <TouchableOpacity style={[styles.colors, styles.color2]} onPress={() => { this.setState({ color: ' #474056' }) }} />
                                <TouchableOpacity style={[styles.colors, styles.color3]} onPress={() => { this.setState({ color: ' #8A95A5' }) }} />
                                <TouchableOpacity style={[styles.colors, styles.color4]} onPress={() => { this.setState({ color: ' #B9C6AE' }) }} />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button}
                            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}>
                            <Text style={styles.buttonText}> Start Chatting</Text>
                        </TouchableOpacity>

                    </View>

                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 45,
        marginTop: '15%',
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        flexDirection: 'column',
        alignItems: 'center',
    },
    main: {
        height: '48%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginTop: '30%',
        padding: '5%',
        backgroundColor: '#FFFFFF'
    },
    text: {
        color: "lightgrey",
        fontSize: 16,
        color: '#757083',
        fontWeight: 'bold',
        textAlign: "center",
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    input: {
        width: '88%',
        padding: '5%',
        marginBottom: '4%',
        height: 50,
        borderColor: '#757083',
        borderWidth: 2,
        borderRadius: 2
    },
    button: {
        height: 50,
        width: '100%',
        padding: '5%',
        backgroundColor: '#757083',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderRadius: 2,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },
    mainColors: {
        flexDirection: 'row',
        marginTop: '3%',
        marginBottom: '3%',
    },
    colors: {
        borderRadius: 20,
        width: 40,
        height: 40,
        marginRight: 30,
    },
    color1: {
        backgroundColor: '#090C08'
    },
    color2: {
        backgroundColor: '#474056'
    },
    color3: {
        backgroundColor: '#8A95A5'
    },
    color4: {
        backgroundColor: '#B9C6AE'
    }
});