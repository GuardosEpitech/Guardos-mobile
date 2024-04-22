import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 2,
    paddingHorizontal: 20, // Add padding to create space between border and text
    alignItems: 'center', // Center content horizontally
  },
  title: {
    marginVertical: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
  },
  text: {
    marginTop: 20,
    textAlign: 'center', // Center text horizontally
  },
  bold: {
    fontWeight: 'bold',
  },
  indentedList: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 20,
  },
  emptySpace: {
    flex: 1,
  }
});

export default styles;
