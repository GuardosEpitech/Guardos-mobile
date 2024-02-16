import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
      profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
      },
      defaultProfilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
      },
      defaultProfilePictureText: {
        fontSize: 16,
        color: 'gray',
      },
      inputContainer: {
        width: '100%',
      },
      dropDownPicker: {
        backgroundColor: '#fafafa',
      },
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
        paddingHorizontal: 20,
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      profilePictureContainer: {
        marginBottom: 20,
      },
      input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20, // Adjusted spacing for consistency
        paddingHorizontal: 10,
        backgroundColor: 'white',
      },
      languagePicker: {
        width: '100%',
        marginBottom: 10, // Adjusted spacing for consistency
      },
      buttonContainer: {
        width: '100%',
        marginTop: 20, // Increased spacing between buttons
        paddingHorizontal: 20, // Added padding to center the button
      },
      logoutButtonContainer: {
        position: 'absolute',
        bottom: 40,
      },
      changePasswordButton: {
        marginBottom: 20, // Adjusted marginBottom to match spacing
      },
      changeLanguageDrop: {
        backgroundColor: 'white',
      },
});

export default styles;