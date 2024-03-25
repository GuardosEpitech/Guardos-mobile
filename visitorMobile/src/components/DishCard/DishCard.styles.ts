import {Dimensions, StyleSheet} from "react-native";

const deviceWidth = Math.round(Dimensions.get('window').width);
const offset = 40;
const radius = 20;
const decreaseSizeOffset = 50;

const styles = StyleSheet.create({
  card: {
    width: deviceWidth - offset,
    backgroundColor: '#FFFFFF',
    height: 230,
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
    width: deviceWidth - offset - decreaseSizeOffset,
    backgroundColor: '#FFFFFF',
    height: 230,
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
  }
});

export default styles;
