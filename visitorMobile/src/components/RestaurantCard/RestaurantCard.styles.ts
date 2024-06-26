import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Math.round(Dimensions.get('window').width);
const offset = 40;
const radius = 20;
const iconSize = 20;
const decreaseSizeOffset = 50;

const styles = StyleSheet.create({
  container: {
    width: deviceWidth - 20,
    alignItems: 'center',
    marginTop: 25,
  },
  containerSmall: {
    width: deviceWidth - 20 - decreaseSizeOffset,
    alignItems: 'center',
    marginTop: 25,
  },
  cardContainer: {
    width: deviceWidth - offset,
    backgroundColor: '#FFFFFF',
    height: 230,
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
  },
  cardContainerSmall: {
    width: deviceWidth - offset - decreaseSizeOffset,
    backgroundColor: '#FFFFFF',
    height: 230,
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
  imageStyleSmall: {
    height: 130,
    width: deviceWidth - offset - decreaseSizeOffset,
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
    opacity: 0.9,
    alignContent: 'center',
    alignSelf: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: '800',
    paddingRight: 6,
  },
  categoryStyle: {
    fontWeight: '200',
    maxHeight: 40,
    overflow: 'hidden',
  },
  infoStyle: {
    marginHorizontal: 10,
    marginVertical: 10,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
  },
  iconButton: {
    marginHorizontal: 5,
    padding: 5,
  },
  icon: {
    width: iconSize,
    height: iconSize,
    resizeMode: 'contain',
  },
  FavoriteIcon: {
    marginLeft: "auto",
    padding: 8,
  },
  cardContainerDarkTheme: {
    width: deviceWidth - offset,
    backgroundColor: '#181A1B',
    height: 230,
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
  },
  cardContainerSmallDarkTheme: {
    width: deviceWidth - offset - decreaseSizeOffset,
    backgroundColor: '#181A1B',
    height: 230,
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
  },
  titleStyleDarkTheme: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white'
  },
  categoryStyleDarkTheme: {
    fontWeight: '200',
    maxHeight: 40,
    overflow: 'hidden',
    color: 'white'
  },
  infoStyleDarkTheme: {
    marginHorizontal: 10,
    marginVertical: 10,
    position: 'relative',
    color: 'white'
  },
  ratingDarkTheme:{
    color: "white"
  }
});

export default styles;
