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
    marginBottom: 20
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
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  languagePicker: {
    width: '100%',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logoutButtonContainer: {
    marginTop: 20,
  },
  changePasswordButton: {
    marginBottom: 20,
  },
  changeLanguageDrop: {
    backgroundColor: 'white',
  },
  dropDown: {
    marginBottom: 20,
  },
  passwordSuccess: {
    marginTop: 50,
    fontSize: 25,
    color: 'green',
  },
  deleteAccountSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  // Dark Theme
  containerDarkTheme: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#1B1D1E'
  },

  inputDarkTheme: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#3B3B3B',
  },

  dropDownDarkTheme: {
    marginBottom: 20,
    backgroundColor: '#3B3B3B',
  },

  deleteAccountSectionDarkTheme: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#1B1D1E',
  },
});

export default styles;
