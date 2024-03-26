import { StyleSheet, Dimensions, Platform } from "react-native";

const deviceWidth = Math.round(Dimensions.get('window').width);
const offset = 40;
const radius = 20;
const iconSize = 20;

const styles = StyleSheet.create({
  
  container: {
    width: deviceWidth,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
  scrollView: {
    alignItems: 'center',
  },
  card: {
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
    textAlign: 'center',
  },
  BtnTypeContainer: {
    flexDirection: 'row',
  },
  BtnType: {
    backgroundColor: '#6D071A',
    color: '#ffffff',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  BtnTypeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  AllergensText: {
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#6D071A',
    padding: 5,
    borderRadius: 15,
  },
  TxtAllergens: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  AllergensLabel: {
    marginRight: 5,
    fontWeight: 'bold',
  },
});

export default styles;