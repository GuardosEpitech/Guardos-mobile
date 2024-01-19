import { StyleSheet } from 'react-native';

const iconSize = 20;

const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 4,
  },
  optionsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'lightgray',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
  },
  iconButton: {
    marginHorizontal: 5,
    padding: 5,
  },
  icon: {
    width: iconSize,
    height: iconSize,
    resizeMode: 'contain',
  },
});

export default styles;
