import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Math.round(Dimensions.get('window').width);
const offset = 40;
const radius = 20;
const iconSize = 20;

const styles = StyleSheet.create({
  container: {
    width: deviceWidth - 20,
    alignItems: 'center',
    marginTop: 25,
  },
  cardContainer: {
    width: deviceWidth - offset,
    backgroundColor: '#FFFFFF',
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
    paddingBottom: 50, 
  },
  cardContainerDarkTheme: {
    width: deviceWidth - offset,
    backgroundColor: '#181A1B',
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
    paddingBottom: 50,
  },
  imageStyle: {
    height: 130,
    width: deviceWidth - offset,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    opacity: 0.9,
    alignContent: 'center',
    alignSelf: 'center',
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: '800',
  },
  titleStyleDarkTheme: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  categoryStyle: {
    fontWeight: '200',
    maxHeight: 40,
    overflow: 'hidden',
  },
  categoryStyleDarkTheme: {
    fontWeight: '200',
    maxHeight: 40,
    overflow: 'hidden',
    color: 'white',
  },
  infoStyle: {
    marginHorizontal: 10,
    marginVertical: 10,
    position: 'relative',
  },
  infoStyleDarkTheme: {
    marginHorizontal: 10,
    marginVertical: 10,
    position: 'relative',
    color: 'white',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    zIndex: 2, 
  },
  iconButton: {
    marginHorizontal: 5,
    padding: 5,
  },
  accordionContainer: {
    marginTop: 20, 
    backgroundColor: '#F9F9F9',
    borderRadius: radius,
    zIndex: 1, 
    marginHorizontal: 10, 
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
  },
  discount: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  discountContainer: {
    marginBottom: 10,
  },
  comboCardContainer: {
    width: deviceWidth - offset - 45, 
    backgroundColor: '#FFFFFF',
    borderRadius: radius,
    elevation: 0,
    marginVertical: 5,
  },
  comboCardContainerDarkTheme: {
    width: deviceWidth - offset - 45, 
    backgroundColor: '#181A1B',
    borderRadius: radius,
    elevation: 0,
    marginVertical: 5, 
  },
});

export default styles;
