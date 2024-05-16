import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  subscriptionCard: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 200,
    overflow: 'hidden',
    marginBottom: 16,
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
    marginBottom: 16,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    fontSize: 20,
    marginRight: 8,
  },
  descriptionText: {
    fontSize: 20,
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
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default styles;
