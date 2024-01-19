import { StyleSheet, Dimensions, Platform } from "react-native";

const gap = 90;
const deviceDisplay = Dimensions.get("window");
const deviceWidth = deviceDisplay.width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  DivTop: {
    marginTop: Platform.OS === 'ios' ? 0 : 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingHorizontal: (gap / -2),
  },
  DivTitleIngr: {
    marginTop: 10,
  },
  TitleIngr: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 32,
    lineHeight: 39,
    textAlign: "center",
    color: "#56885E",
  },
  TitleIngrList: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    color: "#646464",
    marginLeft: 10,
    alignSelf: "flex-start",
    position: "absolute",
  },
  TrashIcon: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
  ImgLogo: {
    width: 105,
    height: 105,
  },
  ViewIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 390,
    height: 66,
    backgroundColor: "#56885E",
    borderRadius: 10,
  },

  RectIngr: {
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4},
    shadowRadius: 10,
    elevation: 1,
    backgroundColor: 'white',
    width: 370,
    height: 80,
    margin: 10,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
  },
  ScrollView: {
    marginTop: 30,
    height: 600,
    width: deviceWidth,
    paddingTop: 10,
  },
  TitleAddIngr: {
    color: "white",
    fontFamily: "Montserrat_700Bold",
    fontSize: 23,
  },
  IconUser: {
    marginHorizontal: gap / 2,
  },
  IconBack: {
    marginHorizontal: gap / 2,
  },
  CategorieTitle: {
    color: "#4D4D4D",
    fontFamily: "Montserrat_700Bold",
    fontSize: 23,
    marginHorizontal: gap / 2,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
});

export default styles;
