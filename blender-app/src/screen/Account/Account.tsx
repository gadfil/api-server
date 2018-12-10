import React, { Component } from 'react'
import { SecureStore } from 'expo'
import { Alert } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { StyleSheet, Text, View } from 'react-native';

export default class Account extends React.Component<{}> {
    state = {
        email: '',
        password: ''
    }
    render(){
        return(
            <View style= {{
                flex: 1,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                <Text>Account</Text>
            </View>)
    }

}

// const loginMutation = gql`
//     mutation Login($email: String!, $password: String!) {
//         Login(email: $email, password: $password) {
//
//             token
//         }
//     }
// `
//
// export default graphql(loginMutation, { name: 'Login' })(Login)