import { StyleSheet, Dimensions, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  lightContainer: {
    backgroundColor: '#FAFAFA',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  inputContainer: {
    padding: 20,
  },
  inputPair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayContainer: {
    marginBottom: 16,
    padding: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  darkModeDayText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white'
  },
  timeText: {
    marginBottom: 4,
    backgroundColor: '#6d071a',
    borderRadius: 10,
    padding: 10,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeTextInside: {
    color: 'white',
    fontWeight: 'bold'
  },

  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
  },
  lightInput: {
    borderColor: 'gray',
    backgroundColor: '#fff',
    color: '#000',
  },
  darkInput: {
    borderColor: '#white',
    backgroundColor: '#333',
    color: '#fff',
  },
  containerPicker: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#white',
  },
  lightPicker: {
    backgroundColor: '#fff',
  },
  darkPicker: {
    backgroundColor: '#333',
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  lightAddButton: {
    backgroundColor: '#007BFF',
  },
  darkAddButton: {
    backgroundColor: '#6C757D',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lightDropdown: {
    backgroundColor: '#fff', // Light mode background
    borderColor: '#ccc', // Light mode border color
  },
  darkDropdown: {
    backgroundColor: '#333', // Dark mode background
    borderColor: '#555', // Dark mode border color
  },
  
  // Dropdown container that shows the items
  lightDropDownContainer: {
    backgroundColor: '#fff', // Light mode dropdown menu background
    borderColor: '#ccc', // Light mode border color
  },
  darkDropDownContainer: {
    backgroundColor: '#333', // Dark mode dropdown menu background
    borderColor: '#555', // Dark mode border color
  },

  // Text inside the dropdown
  lightDropdownText: {
    color: '#000', // Light mode text color
  },
  darkDropdownText: {
    color: '#fff', // Dark mode text color
  },
  // Placeholder text style
  lightPlaceholder: {
    color: '#aaa', // Light mode placeholder color
  },
  darkPlaceholder: {
    color: '#888', // Dark mode placeholder color
  },

  // Arrow icon style
  lightArrowIcon: {
    tintColor: '#000', // Light mode arrow icon color
  },
  darkArrowIcon: {
    tintColor: '#fff', // Dark mode arrow icon color
  },

  // Label text for dropdown items
  lightLabel: {
    color: '#000', // Light mode label color
  },
  darkLabel: {
    color: '#fff', // Dark mode label color
  },
});

export default styles;