import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  
  container: {
    width: deviceWidth,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
  scrollView: {
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  containerDarkTheme: {
    flex: 1,
    width: deviceWidth,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: "#181A1B"
  },
  scrollViewDarkTheme: {
    alignItems: 'center',
    backgroundColor: '#181A1B'
  },
  groupTitleDarkTheme: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
  noMenuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  noMenuTextDarkTheme: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  profileSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  profileButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  activeProfileButton: {
    backgroundColor: '#6d071a',
  },
  profileButtonText: {
    color: '#fff',
  },
});

export default styles;
