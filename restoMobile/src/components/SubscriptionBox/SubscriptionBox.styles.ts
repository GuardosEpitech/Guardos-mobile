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
  subscriptionCardDark: {
    backgroundColor: '#444',
    borderColor: '#666',
  },
  highlighted: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  titleDark: {
    color: 'white',
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
  bulletPointDark: {
    color: 'white',
  },
  descriptionText: {
    fontSize: 20,
  },
  descriptionTextDark: {
    color: 'white',
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
  smallFontDark: {
    color: '#ccc',
  },
  bigFont: {
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
  },
  bigFontDark: {
    color: 'white',
  },
  button: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: '#666',
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
