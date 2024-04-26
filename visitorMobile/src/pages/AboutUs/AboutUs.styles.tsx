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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textDecorationLine: 'underline',
      },
      value: {
        marginBottom: 10,
      },
      valueHeading: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 20,
      },
      member: {
        alignItems: 'center',
        marginBottom: 5,
      },
      photo: {
        width: 100,
        height: 100,
        borderRadius: 25,
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 5,

      },
      centerText: {
        textAlign: 'center',
      },
      textSize: {
        fontSize: 18,
      },
      separator: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 10,
        marginTop: 20,
      },
      memberText: {
        marginTop: 5,
        marginBottom: 20,
      },
      teamContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      memberDetails: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      modalPhoto: {
        width: 200,
        height: 200,
        borderRadius: 50,
        marginBottom: 10,
      },
      closeButton: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#6d071a',
        padding: 10,
        borderRadius: 5,
      },
      closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      containerDarkTheme: {
        flex: 1,
        padding: 20,
        backgroundColor: "#181A1B",
      },
      centerTextDarkTheme: {
        textAlign: 'center',
        color: "white",
      },
});

export default styles;
