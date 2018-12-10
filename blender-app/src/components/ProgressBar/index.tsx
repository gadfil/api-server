import React from 'react'
import { ActivityIndicator, View } from 'react-native'

const ProgressBar = ()=>(
    <View style={{flex:1, justifyContent:'center'}}>
        <ActivityIndicator size="large" color="#ff9068" />
    </View>
)

export default ProgressBar