import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        elevation: 5,
        alignItems: 'center',
      },
      buttonsContainer: {
        flexDirection: 'row',
        marginTop: 16,
      },
      confirmButton: {
        backgroundColor: '#6d071a',
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
      },
      cancelButton: {
        backgroundColor: '#6d071a',
        padding: 12,
        borderRadius: 8,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
  });

  export default styles;