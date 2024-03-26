import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Math.round(Dimensions.get('window').width);

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
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default styles;
