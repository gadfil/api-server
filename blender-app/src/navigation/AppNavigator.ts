import {createStackNavigator} from 'react-navigation'

import Account from '../screen/Account/Account'
import Register from '../screen/register/Register'

export default createStackNavigator({
    Account: {
            screen: Account
        },


    }, {
        navigationOptions:{
            header:null
        }
    }
)

