import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between', 
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
    gap: 10, 
  },
  switchText: {
    fontSize: 14,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '80%', 
    maxWidth: 300,
    alignSelf: 'center', 
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  expiryDateText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  button: {
    marginVertical: 6,   
    width: '80%',         
  },
  containerDark: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between', 
    backgroundColor: '#333',
  },
  headingDark: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: 'white',
  },
  switchTextDark: {
    fontSize: 14,
    color: 'white',
  },
});

export default styles;
