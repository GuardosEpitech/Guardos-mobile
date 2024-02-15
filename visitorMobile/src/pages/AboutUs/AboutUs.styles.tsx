import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
      },
      section: {
        marginBottom: 20,
      },
      heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      value: {
        marginBottom: 10,
      },
      valueHeading: {
        fontWeight: 'bold',
        marginBottom: 5,
      },
      member: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
      },
      photo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
      },
      centerText: {
        textAlign: 'center',
      },
});

export default styles;
