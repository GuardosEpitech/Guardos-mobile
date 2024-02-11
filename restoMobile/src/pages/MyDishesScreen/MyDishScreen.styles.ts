import { StyleSheet} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6d071a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});
  
export default styles;