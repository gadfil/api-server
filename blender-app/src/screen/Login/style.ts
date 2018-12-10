import {StyleSheet} from 'react-native';

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inputContainer: {
        borderBottomColor: 'transparent',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,

        borderBottomWidth: 1,
        width: 250,
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderRadius: 30,

        backgroundColor: 'rgba(255,255,255,0.05)',
        borderBottomColor: 'rgba(255, 255, 255, 0.35);',
        flex: 1,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,

        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: "rgba(255, 255, 255, 0.35)",

    },
    loginText: {
        color: 'white',
    }
});

export default styles;