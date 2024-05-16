import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  userPermissionsContainer: {
    margin: '0 auto',
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subscriptionCard: {
    position: 'relative',
    width: '45%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  highlighted: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  cardTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  descriptionText: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#333',
    color: 'white',
    padding: 8,
    textAlign: 'center',
  },
  buttonHover: {
    backgroundColor: '#555',
  },
});
