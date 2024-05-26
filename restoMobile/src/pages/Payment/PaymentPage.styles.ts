import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    paymentPage: {
        flex: 1,
        alignItems: 'center',
    },
    paymentPageDark: {
        backgroundColor: '#1B1D1E',
    },
    heading: {
        fontSize: 24,
        marginTop: 20,
        color: 'black'
    },
    headingDark: {
        color: 'white'
    },
    containerLoad: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
    },
    containerLoadDark: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
    },
    creditCardsContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    addButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#6d071a',
        marginBottom: 20
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
    },
    noPaymentMethods: {
        fontSize: 16,
        marginTop: 20,
        color: 'black'
    },
    noPaymentMethodsDark: {
        fontSize: 16,
        marginTop: 20,
        color: 'white'
    },
});

export default styles;