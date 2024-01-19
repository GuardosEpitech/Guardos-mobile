import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  textLabel: {
    marginBottom: 8,
  },
  picker: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  } as any,
  addButton: {
    backgroundColor: '#6d071a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  closeModalButton: {
    backgroundColor: '#6d071a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    width: 150,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeModalButtonContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  placeholderText: {
    color: 'gray',
  },
  modalContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  ingredientSuggestionsContainer: {
    maxHeight: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 40,
    backgroundColor: 'white',
    zIndex: 1,
  },
  ingredientSuggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  selectedIngredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  selectedIngredient: {
    backgroundColor: 'lightgray',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  closeSuggestionsButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  closeSuggestionsButtonText: {
    color: 'blue',
  },
  deleteIngredientButton: {
    marginLeft: 8,
    color: 'red', 
    fontWeight: 'bold', 
  },
  ingredientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60, 
  },
});

export default styles;
