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
  containerDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
    },
  smallInputDark: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginRight: 170,
    marginBottom: 10,
    width: '50%',
    color: 'white',
  },
  mainInputDark: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 50,
    marginBottom: 10,
    width: '100%',
    height: '60%',
    color: 'white',
  },
});
  
export default styles;
