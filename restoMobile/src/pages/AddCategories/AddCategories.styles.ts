import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 20,
    },
    dropdownContainer: {
        width: '100%',
        marginBottom: 20,
        zIndex: 1
    },
    scrollContainer: {
        flexGrow: 1, 
    },
    categoryContainers: {
        flex: 1,
        width: '100%',
        zIndex: 2
    },
    categoryItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingVertical: 10,
        width: screenWidth - 20, 
        marginHorizontal: 10, 
    },
    input: {
        height: 40,
        width: '40%',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    addButtonContainer: {
        marginBottom: 20,
    },
    categoryName: {
        fontSize: 16, 
    },
    categoryHitRate: {
        fontSize: 16,
    },
});

export default styles;
