import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, 
  Modal, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { IIngredient, IRestaurantFrontEnd, IProduct } from '../../../../shared/models/restaurantInterfaces';
import { IProductFE } from '../../../../shared/models/productInterfaces';
import { getAllRestaurantsByUser } from "../../services/restoCalls";
import { addNewProduct, editProduct } from '../../services/productCalls';
import styles from './ProductForm.styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from "react-i18next";

interface IDishFormProps {
  productName?: string;
  productIngredients?: string[];
  productRestaurantNames?: string[];
  productId?: number;
  editable?: boolean;
}

// TODO: needs to be modified somehow
const ingredientsSuggestion: IIngredient[] = [
  { name: "Milk" },
  { name: "Wheat" },
  { name: "Egg" },
  { name: "Tomato" },
  { name: "Salt" },
];

const ProductForm: React.FC<IDishFormProps> = ({
  productName: initialProductName = '',
  productIngredients: initialProductIngredients = [],
  productRestaurantNames: initailRestoNames = [],
  productId = 0,
  editable = false,
}) => {
  const navigation = useNavigation();
  const [name, setName] = useState<string>(editable ? initialProductName : '');
  const [restaurants, setRestaurants] = useState<IRestaurantFrontEnd[]>([]);
  const [isRestaurantModalVisible, setRestaurantModalVisible] = useState<boolean>(false);
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>(editable ? initailRestoNames : []);
  const [ingredientSuggestionsVisible, setIngredientSuggestionsVisible] = useState<boolean>(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(initialProductIngredients || []);
  const [availableIngredientSuggestions, setAvailableIngredientSuggestions] = useState<IIngredient[]>(ingredientsSuggestion);
  const [productIdEdit, setProductId] = useState<number>(productId || 0 );
  const {t} = useTranslation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const allRestaurants = await getAllRestaurantsByUser({key: userToken});
        setRestaurants(allRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
    setAvailableIngredientSuggestions(ingredientsSuggestion);
  }, []);

  const toggleRestaurantModal = () => {
    setRestaurantModalVisible(!isRestaurantModalVisible);
  };

  const handleSelectRestaurant = (restaurantName: string) => {
    setSelectedRestaurants((prevSelection) => {
      if (prevSelection.includes(restaurantName)) {
        return prevSelection.filter((name) => name !== restaurantName);
      } else {
        return [...prevSelection, restaurantName];
      }
    });
  };

  const handleDeleteRestaurant = (restaurant: string) => {
    setSelectedRestaurants((prevSelection) => prevSelection.filter((item) => item !== restaurant));
  };

  const handleAddProduct = async () => {
    try {
      if (!name || selectedRestaurants.length === 0) {
        console.error('Name and Restaurant are required.');
        return;
      }

      const product: IProduct = {
        name,
        allergens: [],
        ingredients: selectedIngredients,
      };

      if (!editable) {
        for (const selectedRestoName of selectedRestaurants) {
          await addNewProduct(product, selectedRestoName);
        }
      }

      if (editable) {
        const selectedId: number[] = selectedRestaurants.map((id) => restaurants.find((restaurant) => restaurant.name === id).uid).filter(Boolean);
        const productFE: IProductFE = {
          name,
          id: productIdEdit,
          allergens: [],
          ingredients: selectedIngredients,
          restaurantId: selectedId,
        }
        await editProduct(productFE, initialProductName);
      }

      navigation.navigate('MyProductsScreen');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleSelectIngredient = (ingredient: string) => {
    setSelectedIngredients((prevIngredients) => {
      if (prevIngredients.includes(ingredient)) {
        return prevIngredients.filter((name) => name !== ingredient);
      } else {
        return [...prevIngredients, ingredient];
      }
    });
  };

  const handleDeleteIngredient = (ingredient: string) => {
    setSelectedIngredients((prevIngredients) => prevIngredients.filter((item) => item !== ingredient));
  };

  const toggleIngredientSuggestions = () => {
    setIngredientSuggestionsVisible(!ingredientSuggestionsVisible);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder={t('components.ProductForm.product-name') as string}
            placeholderTextColor={styles.placeholderText.color}
            value={name}
            onChangeText={(text) => setName(text)}
          />
           <TouchableOpacity
            style={styles.input}
            onPress={toggleIngredientSuggestions}
          >
            <View style={styles.selectedIngredientsContainer}>
              {selectedIngredients.length === 0 ? (
                <Text style={styles.placeholderText}>{t('common.ingredients')}</Text>
              ) : (
                selectedIngredients.map((ingredient) => (
                  <TouchableOpacity
                    key={ingredient}
                    style={styles.selectedIngredient}
                    onPress={() => handleDeleteIngredient(ingredient)}
                  >
                    <Text>{ingredient}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={false}
            visible={ingredientSuggestionsVisible}
            onRequestClose={() => {}}
            style={styles.modalContent}
          >
            <View style={{ flex: 1, paddingTop: 50 }}>
              <FlatList
                data={availableIngredientSuggestions}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.ingredientItem,
                      { backgroundColor: selectedIngredients.includes(item.name) ? 'lightgray' : 'white' },
                    ]}
                    onPress={() => handleSelectIngredient(item.name)}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.closeModalButtonContainer}>
                <TouchableOpacity onPress={toggleIngredientSuggestions} style={styles.closeModalButton}>
                  <Text style={styles.closeModalButtonText}>{t('components.ProductForm.select-ingredients')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            style={styles.input}
            onPress={toggleRestaurantModal}
          >
            <View style={styles.selectedIngredientsContainer}>
              {selectedRestaurants.length === 0 ? (
                <Text style={styles.placeholderText}>{t('common.restos')}</Text>
              ) : (
                selectedRestaurants.map((restaurant) => (
                  <TouchableOpacity
                    key={restaurant}
                    style={styles.selectedIngredient}
                    onPress={() => handleDeleteRestaurant(restaurant)}
                  >
                    <Text>{restaurant}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={false}
            visible={isRestaurantModalVisible}
            onRequestClose={() => {}}
            style={styles.modalContent}
          >
            <View style={{ flex: 1, paddingTop: 50 }}>
              <FlatList
                data={restaurants}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.ingredientItem,
                      { backgroundColor: selectedRestaurants.includes(item.name) ? 'lightgray' : 'white' },
                    ]}
                    onPress={() => handleSelectRestaurant(item.name)}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.closeModalButtonContainer}>
                <TouchableOpacity onPress={toggleRestaurantModal} style={styles.closeModalButton}>
                  <Text style={styles.closeModalButtonText}>{t('components.ProductForm.select-restos')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddProduct}
          >
            {editable ? (
              <Text style={styles.buttonText}>{t('components.ProductForm.edit-product')}</Text>
            ) : (
              <Text style={styles.buttonText}>{t('components.ProductForm.add-product')}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ProductForm;
