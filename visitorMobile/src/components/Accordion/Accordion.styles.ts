import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
  accordion: {
    backgroundColor: '#fff',
    borderRadius: 5,
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: "100%",
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    marginLeft: 10,
  },
  accordionDarkTheme: {
    backgroundColor: '#181A1B',
    borderRadius: 5,
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  titleContainerDarkTheme: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#181A1B',
  },
  titleDarkTheme: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default styles;
