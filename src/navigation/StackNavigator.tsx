import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Photos from '../Features/ImageGallery/view/Photos'
import PhotoDetail from '../Features/ImageGallery/view/PhotoDetail'
import { RootStackParamList } from './types'


const StackNavigator = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    return (
        <Stack.Navigator>
            <Stack.Screen name="Photos" component={Photos} />
            <Stack.Screen name="PhotoDetail" component={PhotoDetail} />
        </Stack.Navigator>
    )
}

export default StackNavigator