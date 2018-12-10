import React, { Component } from 'react'
import { SecureStore } from 'expo'
import ProgressBar from '../../components/ProgressBar/index'
import { NavigationScreenProps } from "react-navigation";

export interface IProps extends NavigationScreenProps {}

class Loading extends React.Component<IProps,{}> {
    constructor(props:IProps) {
        super(props)
        this.bootstrapAsync()
    }

    bootstrapAsync = async () => {
        const userToken = await SecureStore.getItemAsync('token')
        this.props.navigation.navigate(userToken ? 'App' : 'Login')
    }

    render() {
        return <ProgressBar />
    }
}

export default Loading