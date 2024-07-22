import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between', // Distribute space between title and buttons
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
    gap: 10, // Adjust gap between elements in the switch container
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '80%', // Adjust width to center on X-axis
    maxWidth: 300,
    alignSelf: 'center', // Center input field horizontally
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
    marginVertical: 6,   // Adjusted margin to reduce distance between buttons
    width: '80%',         // Adjust width for better appearance
  },
});

export default styles;
