import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  subscriptionCard: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 200,
    overflow: 'hidden',
  },
  highlighted: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  descriptionList: {
    fontSize: 20,
    marginBottom: 16,
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 16,
  },
  smallFont: {
    fontSize: 12,
    color: '#777',
  },
  bigFont: {
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#333',
    color: 'white',
    borderWidth: 0,
    padding: 8,
    textAlign: 'center',
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
