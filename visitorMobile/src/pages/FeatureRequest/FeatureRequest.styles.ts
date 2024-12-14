import {StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 170,
    marginBottom: 10,
    width: '50%',
  },
  mainInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 50,
    marginBottom: 10,
    width: '100%',
    height: '60%',
  },
  //Dark Mode
  containerDarkTheme: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#181A1B',
    },
  smallInputDarkTheme: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 170,
    marginBottom: 10,
    width: '50%',
    backgroundColor: '#181A1B',
  },
  mainInputDarkTheme: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 50,
    marginBottom: 10,
    width: '100%',
    height: '60%',
    backgroundColor: '#181A1B',
  }
});
  
export default styles;
