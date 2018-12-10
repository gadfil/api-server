//@ts-ignore

import { createSwitchNavigator , createAppContainer } from 'react-navigation'
import AppNavigator from "./AppNavigator";
import LoginNavigator from "./LoginNavigator";
import Loading from "../screen/Loading";

export default createAppContainer( createSwitchNavigator(
    {
        Loading,
        Login: LoginNavigator,
        App: AppNavigator,
        // App: AppNavigator
    },
    {
        initialRouteName: 'Loading'
    }
))