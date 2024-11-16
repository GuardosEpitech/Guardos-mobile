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

  button: {
    padding: 10,
    width: '30%',
    backgroundColor: "#6d071a",
    alignItems: "center",
    borderRadius: 10,
    margin:10,
    marginLeft: 0
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
  shareIconContainer: {
    position: 'relative',
    backgroundColor: 'grey',
    borderRadius: 15,
    marginBottom: 1,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
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
  },
  Icon: {
    marginRight: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: deviceWidth * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalBackgroundDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '##181A1B',
  },
  modalContaineDark: {
    width: deviceWidth * 0.8,
    padding: 20,
    backgroundColor: '#181A1B',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalTitleDark: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white'
  },
  modalTextDark: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 20,
    color: 'white',
  },
});

export default styles;
