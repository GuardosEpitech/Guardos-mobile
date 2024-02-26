import { StyleSheet, Platform } from "react-native";
const gap = Platform.OS === 'ios' ? 70 : 55;


const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    height: 320,
    width: 290,
    justifyContent: "center",
    alignItem: "center",
  },
  DivTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  IconUser: {
    marginHorizontal: gap / 2,
  },
  IconBack: {
    marginHorizontal: gap / 2,
  },
  TitleIngr: {
    marginTop: 20,
    marginBottom: 20,
    fontFamily: "Montserrat_700Bold",
    fontSize: 32,
    lineHeight: 39,
    textAlign: "center",
    color: "#6d071a",
  },
  ButtonNo: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    marginRight: 50,
    borderColor: "#6d071a",
    borderWidth: 1,
  },
  ButtonYes: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#6d071a",
  },
  DivButton: {
    backgroundColor: "#FFFFFF",
    width: 370,
    height: 170,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  TitleScan: {
    fontSize: 20,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 30,
    fontWeight: "bold",
  },
  image: {
    flex: 1,
  },
  CategorieTitle: {
    color: "#4D4D4D",
    fontFamily: "Montserrat_700Bold",
    fontSize: 23,
    marginHorizontal: gap / 2,
  },
  DivTop2: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingHorizontal: (gap / -2),
  },
  dropdown: {
    margin: 16,
    height: 50,
    width: 300,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  DivTitleIngr: {
    margin: 0,
    padding: 0,
  },
});

export default styles;
