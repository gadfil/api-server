import React, {Component} from 'react'
import {SecureStore} from 'expo'
import {Alert, Button, ActivityIndicator} from 'react-native'
import {graphql, QueryProps} from 'react-apollo'
import gql from 'graphql-tag'
import {StyleSheet, Text, View, TextInput, TouchableHighlight, Image} from 'react-native';
import {LinearGradient} from 'expo'
import {NavigationScreenProps} from "react-navigation";
import styles from './style'
import {Mutation} from "react-apollo";

export interface IProps extends NavigationScreenProps {
}

export interface IState {
    email: string
    password: string
}

class Login extends React.Component<IProps, IState> {
// class Login extends React.Component<Partial<QueryProps<FindUserQuery, FindUserVariables>>>{
state = {
        email: '',
        password: ''
    }

    validate = (): boolean => {
        const {email, password} = this.state
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailTest = re.test(email)
        if (emailTest && password) {
            return true
        }
        return false
    }

    render() {
        const {email, password} = this.state
        return (
            <Mutation mutation={loginMutation} variables={{email, password}}
                      onCompleted={ (data)=>console.log('onCompleted', data)}
                      onError={(error) => {
                          if (error) {
                              const message = error.graphQLErrors.map(({message}) => message).join()
                              Alert.alert('Error', message, [{text: 'Ok'}])
                          }
                      }}>
                {(login, {loading, error, data}) => {
                    console.log(loading, error, data)

                    return (

                        <LinearGradient colors={['#ff9068', '#fd746c']}
                                        style={{
                                            justifyContent: 'space-between',
                                            flex: 1,
                                            alignItems: 'center',
                                            borderRadius: 5
                                        }}>
                            <View style={styles.container}>
                                <View style={styles.inputContainer}>
                                    <TextInput style={styles.inputs}
                                               placeholder="Email"
                                               keyboardType="email-address"
                                               autoCapitalize='none'

                                               underlineColorAndroid='transparent'
                                               onChangeText={(email) => this.setState({email})}/>
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput style={styles.inputs}
                                               placeholder="Password"
                                               secureTextEntry={true}
                                               autoCapitalize='none'

                                               underlineColorAndroid='transparent'
                                               onChangeText={(password) => this.setState({password})}/>
                                </View>

                                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]}
                                                    disabled={!this.validate()}
                                                    underlayColor={"rgba(255, 255, 255, 0.50)"}
                                                    onPress={() => login()}>
                                    {loading ? <ActivityIndicator size="small" color="white"/> :
                                        <Text style={styles.loginText}>Login</Text>}
                                </TouchableHighlight>

                                <TouchableHighlight style={styles.buttonContainer}>
                                    <Text>Register</Text>
                                </TouchableHighlight>
                            </View>
                        </LinearGradient>
                    )
                }}
            </Mutation>
        )
    }

}


const loginMutation = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {

            token
        }
    }
`

export default graphql(loginMutation, {name: 'Login'})(Login)