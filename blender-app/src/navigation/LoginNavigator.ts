import {createStackNavigator} from 'react-navigation'

import Login from '../screen/Login/Login'
import Register from '../screen/register/Register'

export default createStackNavigator({
        Login: {
            screen: Login
        },
        Register: {
            screen: Register
        }

    }, {
    navigationOptions:{
        header:null
    }
    }
)

