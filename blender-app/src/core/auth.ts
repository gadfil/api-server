import { SecureStore } from 'expo'

export const  getToken =  async () => SecureStore.getItemAsync('token')
