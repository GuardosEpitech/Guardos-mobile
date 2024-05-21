import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6d071a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
  },

  containerDarkTheme: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1B1D1E"
  },

  ErrorMsg: {
    fontSize: 28,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkModeTxt: {
    color: 'white'
  }
});

export default styles;
