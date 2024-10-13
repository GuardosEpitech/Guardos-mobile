import { StyleSheet, Dimensions, Platform } from "react-native";

const deviceWidth = Math.round(Dimensions.get('window').width);
const deviceHeight = Math.round(Dimensions.get('window').height);
const offset = 40;
const radius = 20;
const iconSize = 20;

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: deviceHeight,
    alignItems: 'center',
  },
  scrollView: {
    alignItems: 'center',
    paddingBottom: 150,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 9,
    overflow: 'hidden',
  },
  cardImage: {
    height: 130,
    width: deviceWidth - offset,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    opacity: 0.9,
    alignContent: 'center',
    alignSelf: 'center',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  containerDarkTheme: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1D1E'
  },
  cardDarkTheme: {
    backgroundColor: '#3B3B3B',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 9,
    overflow: 'hidden',
  },
  cardTitleDarkTheme: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white"
  },
  groupTitleDarkTheme: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: "white"
  },
  discount: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  discountContainer: {
    marginBottom: 10,
  },
  noMenuText: {
    fontSize: 28,
    textAlign: "center",
  },
  noMenuTextDarkTheme: {
    color: 'white',
  },
});

export default styles;
