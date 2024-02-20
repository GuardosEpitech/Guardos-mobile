import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  registerInfo: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  registerLink: {
    color: '#6d071a',
    textDecorationLine: 'underline',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  containerFlex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'space-around'
  },
  flexItem: {
    width: 60,
    height: 60
  },
  dividerLogos: {
    width: 1,
    height: 65,
    backgroundColor: '#000000',
    opacity: 0.1
  },
  containerDivider: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center'
  },
  divider: {
    height: 1,
    width: 100,
    backgroundColor: '#000',
    marginVertical: 20,
    opacity: 0.1,
  },
  flexItemGoogle: {
    width: 60,
    height: 62
  }
});

export default styles;
