import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 2,
    paddingHorizontal: 20, 
    alignItems: 'center', 
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
    textAlign: 'center', 
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
