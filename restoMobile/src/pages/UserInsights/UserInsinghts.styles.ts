import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  darkContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#333",
  },
  card: {
    marginBottom: 16,
  },
  darkCard: {
    backgroundColor: "#333",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    margin: 4,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon

  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

const pickerSelectStylesDark = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon

  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'white',
    paddingRight: 30,
  },
});

export {styles, pickerSelectStyles, pickerSelectStylesDark};
