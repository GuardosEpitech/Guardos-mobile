import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryContainers: {
        marginTop: 20,
        alignItems: 'center',
    },
    categoryContainer: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10, // Added border radius for rounded corners
    },
    categoryItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        height: 40,
        width: '40%', // Adjusted width to fix size
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default styles;
