import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10, 
  },
  button: {
    backgroundColor: '#6d071a', 
    borderRadius: 10, 
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    paddingTop: 20,
    alignSelf: 'center',
    alignItems: 'stretch',
    width: '95%',
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  starIcon: {
    marginRight: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  websiteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  navigateButton: {
    backgroundColor: '#6d071a',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 5,
  },
  menuButton: {
    backgroundColor: '#6d071a',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: 'auto',
    marginTop: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  filterButton: {
    position: 'absolute',
    top: 70,
    right: 10,
    backgroundColor: '#6d071a',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIconContainer: {
    position: 'relative',
    backgroundColor: 'grey',
    borderRadius: 15,
    marginBottom: 1,
    marginRight: 330,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
  },  

  // Filter Popup Styles
  modalContentDarkTheme: {
    backgroundColor: '#181A1B',
    borderRadius: 10,
    padding: 10,
    paddingTop: 20,
    alignSelf: 'center',
    alignItems: 'stretch',
    width: '95%',
  },
  headingContainerDarkTheme: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  headingTextDarkTheme: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  locationContainerDarkTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#181A1B',
    color: 'white',
  },
  websiteContainerDarkTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#181A1B',
    color: 'white',
  },
  phoneContainerDarkTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#181A1B',
    color: 'white',
  },
  starIconDarkTheme: {
    marginRight: 5,
    color: 'white',
  },
  filterPopup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  popupHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  clearButton: {
    backgroundColor: '#6d071a',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonContainerPopup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  filterPopupButton: { 
    backgroundColor: '#6d071a',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonTextPopup: {
    color: 'white',
  },
  filterCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryText: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 20,
  },
  categoryCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  distanceText: {
    marginBottom: 15,
    fontSize: 18,
  },
  thumb: {
    width: 15, 
    height: 15, 
    borderRadius: 15 / 2, 
    backgroundColor: '#6d071a', 
  },
  threeDotMenuButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 10,
    backgroundColor: '#6d071a',
    borderRadius: 50,
    zIndex: 1, 
  },

  // Add these styles for the filter options modal container
  filterOptionsContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  savedFilterItem: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterNameContainer: {
    flex: 1,
  },
  saveButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadFilterButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteFilterButton: {
    backgroundColor: '#6d071a',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  saveInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1, 
    color: 'black',
    marginBottom: 10,
  },
  savedFilterName: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center' 
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
  },
  categoryBox: {
    width: '48%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    marginTop: 6,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainerDarkTheme: {
    backgroundColor: '#181A1B',
    borderColor: 'white',
  },
  inputDarkTheme: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    backgroundColor: 'grey',
    borderRadius: 10, 
    color: 'white',
  },
  centerButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#6d071a",
    borderRadius: 25,
    padding: 10,
  },
  filterPopupDark: {
    backgroundColor: '#181A1B',
    padding: 20,
    borderRadius: 10,
  },
  darkModeTxt: {
    color: 'white'
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  listItemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemHeading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemDescription: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  listItemLocation: {
    fontSize: 12,
    marginTop: 5,
    color: '#888',
  },
});

export default styles;
