import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#f2f2f2', // Light background color
        borderRadius: 10, // Rounded corners
      },
      input: {
        flex: 1,
        height: 40,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff', // White background color
        borderRadius: 10, // Rounded corners
      },
      button: {
        backgroundColor: '#6d071a', // Red background color
        borderRadius: 10, // Rounded corners
        paddingVertical: 10,
        paddingHorizontal: 15,
      },
      buttonText: {
        color: '#fff', // White text color
        fontSize: 16,
      },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      paddingTop: 20,
      alignSelf: 'center',
      alignItems: 'stretch',
      width: '95%', 
    },
    modalImage: {
      width: '100%',
      height: 250,
      borderRadius: 10,
      marginBottom: 10,
      marginTop: 20,
    },
    headingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headingText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
      },
    
      starIcon: {
        marginRight: 5,
      },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    buttonContainer: {
      flexDirection: 'column',
      alignItems: 'center', 
      marginTop: 10, 
    },
    navigateButton: {
      backgroundColor: '#6d071a',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10, 
      paddingHorizontal: 15,
      marginTop: 5,
    },
    menuButton: {
      backgroundColor: '#6d071a',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      width: 'auto',
      marginTop: 5,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    filterButton: {
        position: 'absolute',
        top: 70,
        right: 10,
        backgroundColor: '#6d071a',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
    
      // Filter Popup Styles
      filterPopup: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
      },
      popupHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      clearButton: {
        backgroundColor: '#6d071a',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
      },
      buttonContainerPopup: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
      },
      filterPopupButton: { // Rename filterButton to filterPopupButton
        backgroundColor: '#6d071a',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
      },
      buttonTextPopup: {
        color: 'white',
      },
      filterCloseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
      },
      categoryContainer: {
        marginTop: 20,
      },
      categoryText: {
        fontWeight: 'bold',
        marginBottom: 5,
      },
      categoryCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      thumb: {
        width: 15, // Adjust the width of the thumb (circle)
        height: 15, // Adjust the height of the thumb (circle)
        borderRadius: 15 / 2, // Make it a circle
        backgroundColor: '#6d071a', // Thumb color
      },
  });

export default styles;