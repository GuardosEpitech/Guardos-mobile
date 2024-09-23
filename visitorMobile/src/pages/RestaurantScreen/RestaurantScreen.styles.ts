import { StyleSheet, Dimensions} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  content: {
    flex: 1,
  },
  filterLimit: {
    color: '#666',
    fontSize: 15,
    marginLeft: 2,
  },
  roundButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#6d071a',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  scrollView: {
    position: 'absolute',
    bottom: windowHeight * 0.11,
    right: windowWidth * 0.02,
    width: windowWidth * 0.9,
    maxHeight: windowHeight * 0.65,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    padding: 10,
  },
  tabContainer: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  thumbStyle: {
    width: 20,
    height: 20, 
    borderRadius: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 0,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#e2b0b3',
    width: 100,
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    margin: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  popupHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  categoryText: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 20,
  },
  filterPopup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  filterPopupDark: {
    backgroundColor: '#181A1B',
    padding: 20,
    borderRadius: 10,
  },
  distanceText: {
    marginBottom: 15,
    fontSize: 18,
  },
  distanceTextDark: {
    color: 'white',
    marginBottom: 15,
    fontSize: 18,
  },
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
  containerDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181A1B',
  },
  searchContainerDarkTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#181A1B',
    borderRadius: 10,
  },
  inputDarkTheme: {
    flex: 1,
    height: 40,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    backgroundColor: 'grey',
    borderRadius: 10, 
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
