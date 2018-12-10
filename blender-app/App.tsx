import * as React from 'react';
import {NavigatorIOS, StyleSheet, Text, View} from 'react-native';
import gql from "graphql-tag";
import * as auth from './src/core/auth'
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Navigation from './src/navigation/SwitchNavigator'

const client = new ApolloClient({
    uri: "http://192.168.1.39:4000/graphql",
    // uri: "http://localhost:4000",
    fetchOptions: {
        credentials: 'include'
    },
    request: async operation => {
        const token = await auth.getToken()

        operation.setContext({
            headers: {
                authorization: token ? token : ''
            }
        })
    }
})


export default class App extends React.Component<{}> {
  render() {
    return (
     <ApolloProvider client={ client}>
         <Navigation />
     </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
