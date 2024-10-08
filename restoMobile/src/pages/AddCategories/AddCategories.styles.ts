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
        flexGrow: 1
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
        width: '35%',
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
    iconButton: {
        marginHorizontal: 1,
        padding: 1,
      },
    // Dark theme
    containerDarkTheme: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#181A1B'
    },
    dropdownContainerDarkTheme: {
        width: '100%',
        marginBottom: 20,
        zIndex: 1,
        backgroundColor: '#181A1B',
        color: '#181A1B',
    },
    categoryContainersDarkTheme: {
        flex: 1,
        width: '100%',
        zIndex: 2,
        backgroundColor: '#181A1B'
    },
    scrollContainerDarkTheme: {
        flexGrow: 1,
        backgroundColor: '#181A1B'
    },
    categoryNameDarkTheme: {
        fontSize: 16, 
        color: 'white'
    },
    categoryHitRateDarkTheme: {
        fontSize: 16,
        color: 'white'
    },
    categoryItemContainerDarkTheme: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        width: screenWidth - 20, 
        marginHorizontal: 10, 
    },
    ErrorMsg: {
        fontSize: 28,
        textAlign: "center",
      },
      darkModeTxt: {
        color: 'white'
      },
      centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        // width: '100%',
        paddingHorizontal: 20,
    },
});

export default styles;
