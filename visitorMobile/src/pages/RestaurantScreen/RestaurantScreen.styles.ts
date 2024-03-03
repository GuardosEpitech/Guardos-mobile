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
    top: -5,
    right: -5,
}
});


export default styles;
