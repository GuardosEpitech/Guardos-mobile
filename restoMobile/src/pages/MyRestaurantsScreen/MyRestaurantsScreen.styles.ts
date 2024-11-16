import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton: {
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
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  containerDarkTheme: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1D1E',
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#6d071a',
    borderRadius: 80,
    width: screenWidth - 40,
    marginTop: 5,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },

  searchInputDark: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#6d071a',
    borderRadius: 80,
    width: screenWidth - 40,
    marginTop: 5,
    backgroundColor: '#333',
    alignSelf: 'center',
  },

  ErrorMsg: {
    fontSize: 28,
    textAlign: "center",
  },
  darkModeTxt: {
    color: 'white'
  }
});
  
export default styles;
