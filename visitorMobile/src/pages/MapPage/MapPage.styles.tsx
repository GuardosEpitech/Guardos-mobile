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

  // Filter Popup Styles
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
});

export default styles;
