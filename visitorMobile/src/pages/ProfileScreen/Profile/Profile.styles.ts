import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    paddingBottom: 10,
    fontSize: 20,
  },
  profilePicture: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  restaurantSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  restaurantItem: {
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  logoutSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  logoutButton: {
    margin: 10,
    padding: 20,
    borderRadius: 4,
  }
});

export default styles;
