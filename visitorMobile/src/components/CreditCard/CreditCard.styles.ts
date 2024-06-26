import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  creditCard: {
    width: 350,
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    marginBottom: 10,
  },
  creditCardDark: {
    backgroundColor: '#3B3B3B'
  },
  brand: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  brandDark: {
    color: 'white'
  },
  cardNumberContainer: {
    position: 'absolute',
    top: '70%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cardNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  cardNumberDark: {
    color: 'white'
  },
  cardNumberDigit: {
    fontSize: 24,
  },
  last4: {
    fontSize: 24,
  },
  last4Dark: {
    color: 'white'
  },
  cardInfo: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    left: 20,
    right: 20,
  },
  name: {
    fontWeight: 'bold',
  },
  nameDark: {
    color: 'white'
  },
  expiresOn: {
    fontSize: 16,
    color: '#666',
  },
  expiresOnDark: {
    color: 'white'
  },
  menu: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  });

  export default styles;