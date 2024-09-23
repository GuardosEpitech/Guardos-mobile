import { StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  containerDark: {
    flex: 1,
    padding: 16,
    backgroundColor: '#333',
  },
  titleDark: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#fff',
  },
});

export default styles;