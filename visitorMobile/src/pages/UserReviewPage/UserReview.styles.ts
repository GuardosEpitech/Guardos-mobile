import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 5,
        borderRadius: 10,
    },
    dropdown: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    mainTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    containerStar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    note: {
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft:5
    },
    comment: {
        marginTop: 5,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#6d071a',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '20%',
        fontWeight: "bold"
    }
})

export default styles