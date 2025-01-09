import {Dimensions, StyleSheet} from "react-native";

const deviceWidth = Math.round(Dimensions.get('window').width);
const offset = 40;
const radius = 20;
const decreaseSizeOffset = 50;

const styles = StyleSheet.create({
  card: {
    width: deviceWidth - offset,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 9,
    position: 'relative',
    overflow: 'hidden',
  },
  cardSmall: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 9,
    position: 'relative',
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
  cardImageSmall: {
    height: 130,
    width: deviceWidth - offset - decreaseSizeOffset,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    opacity: 0.9,
    alignContent: 'center',
    alignSelf: 'center',
  },
  cardContent: {
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 6,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  favoriteIcon: {
    paddingLeft: 0.8,
    paddingTop: 0.2,
  },
  cardDarkTheme: {
    width: deviceWidth - offset,
    backgroundColor: '#181A1B',
    height: 250,
    margin: 20,
    borderRadius: radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 9,
    position: 'relative',
    overflow: 'hidden',
  },
  cardSmallDarkTheme: {
    width: deviceWidth - offset - decreaseSizeOffset,
    backgroundColor: '#181A1B',
    height: 250,
    margin: 10,
    borderRadius: radius,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 9,
    position: 'relative',
    overflow: 'hidden',
  },
  titleContainerDarkTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    color: "white"
  },
  cardTitleDarkTheme: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 6,
    color: "white"
  },
  descriptionDarkTheme:{
    color: "white"
  },
  priceDarkTheme:{
    color: "white"
  },
  smallTitle:{
    fontWeight: 'bold',
  },
  normalText:{
    fontWeight: "normal",
  },
  row: {
    flexDirection: "row",
  },
  allergensDarkTheme:{
    color: "white"
  },
  discount: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  accordionContainer: {
    marginTop: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: radius,
    zIndex: 1,
    marginHorizontal: 10,
    marginBottom: 10
  },
  accordionHeader: {
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: radius,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    zIndex: 1,
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  comboContainer: {
    marginHorizontal: 0,
    borderRadius: radius,
    backgroundColor: '#F1F1F1',
    zIndex: 1,
    paddingHorizontal: 5,
    marginBottom: 10
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginVertical: 5,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#6d071a',
  },
  pillText: {
    fontSize: 11,
    color: 'white',
  },
});

export default styles;
