import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
      },
      contactInfo: {
        paddingBottom: 20, // Adjust this value according to your preference
      },
      contactForm: {
        backgroundColor: 'white',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
      },
      button: {
        backgroundColor: '#6d071a',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
      },
      message: {
        textAlign: 'center',
        marginTop: 10,
      },
});

export default styles;