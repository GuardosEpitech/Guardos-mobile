import {
  Alert,
  Button,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import styles from "../EditDishScreen/EditDish.style";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAllProducts } from "../../services/productCalls";
import { getAllResto, getRestaurantByName } from "../../services/restoCalls";
import * as ImagePicker from 'expo-image-picker';


const EditDish = ({ route }) => {
  const { restaurantName } = route.params;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [pictures, setPictures] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentType, setModalContentType] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);



  const onProductPress = (item: string) => {
    const updatedProducts = selectedProducts.filter(product => product !== item);
    setSelectedProducts(updatedProducts);
  };

  const onAllergenPress = (item: string) => {
    const updatedAllergens = selectedAllergens.filter(allergen => allergen !== item);
    setSelectedAllergens(updatedAllergens);
  }

  const onCategoryPress = (item: string) => {
    const updatedCategories = selectedCategories.filter(category => category !== item);
    setSelectedCategories(updatedCategories);
  }

  const onRestaurantPress = (item: string) => {
    const updatedRestaurants = selectedRestaurants.filter(restaurant => restaurant !== item);
    setSelectedRestaurants(updatedRestaurants);
  }

  const onAddProduct = async () => {
    const allProducts = await getAllProducts();
    //@ts-ignore
    const newProducts = allProducts.filter(prod => !products.includes(prod.name)).map(prod => prod.name);
    setProducts([...products, ...newProducts]);

    setModalContentType('Products');
    setModalVisible(true);
  };

  const onAddAllergen = () => {
    const newAllergens = allergens.filter(allergen => !selectedAllergens.includes(allergen));
    setAllergens([...selectedAllergens, ...newAllergens]);

    setModalContentType('Allergens');
    setModalVisible(true);
  };


  const onAddCategory = async () => {
    const restaurant = await getRestaurantByName(restaurantName);
    const categories = restaurant.categories;

    //@ts-ignore
    const newCategories = categories.filter(cat => !category.includes(cat.name)).map(cat => cat.name);
    setCategory([...category, ...newCategories]);

    setModalContentType('Categories');
    setModalVisible(true);
  };

  const onAddRestaurant = async () => {
    const allRestaurants = await getAllResto();
    //@ts-ignore
    const newRestaurants = allRestaurants.filter(resto => !restaurants.includes(resto.name)).map(resto => resto.name);
    setRestaurants([...restaurants, ...newRestaurants]);

    setModalContentType('Restaurants');
    setModalVisible(true);
  }


  const toggleProductsSelection = (item: string) => {
    if (selectedProducts.includes(item)) {
      setSelectedProducts(selectedProducts.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedProducts([...selectedProducts, item]);
    }
  };

  const toggleAllergensSelection = (item: string) => {
    if (selectedAllergens.includes(item)) {
      setSelectedAllergens(selectedAllergens.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedAllergens([...selectedAllergens, item]);
    }
  }

  const toggleCategoriesSelection = (item: string) => {
    if (selectedCategories.includes(item)) {
      setSelectedCategories(selectedCategories.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedCategories([...selectedCategories, item]);
    }
  }

  const toggleRestaurantsSelection = (item: string) => {
    if (selectedRestaurants.includes(item)) {
      setSelectedRestaurants(selectedRestaurants.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedRestaurants([...selectedRestaurants, item]);
    }
  }

  const removePicture = (pictureUrl: string) => {
    setPictures(pictures.filter(p => p !== pictureUrl));
  };

  const changePicture = async () => {
    // Berechtigungen anfordern
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        setPictures([result.assets[0].uri, ...pictures]);
      }
    }
  };

  useEffect(() => {
    try {
      const allergens = ["No Allergens", "Celery", "Gluten",
        "Crustaceans", "Eggs", "Fish", "Lupin", "Milk", "Molluscs", "Mustard",
        "Nuts", "Peanuts", "Sesame seeds", "Soya", "Sulphur dioxide", "Lactose"];

      const category = [route.params.dish.category.foodGroup];
      setName(route.params.dish.name);
      setPrice(route.params.dish.price.toString());
      setDescription(route.params.dish.description);
      setPictures(route.params.dish.pictures);
      setAllergens(allergens);
      setSelectedCategories(category);
      setProducts(route.params.dish.products);
      setSelectedProducts(route.params.dish.products);
      setSelectedAllergens(route.params.dish.allergens);
      setSelectedRestaurants([restaurantName]);
    } catch (error) {
      console.error('Error fetching dish data:', error);
    }
  }, [restaurantName]);

  const handleSave = async () => {
    console.log('clicked on save');
    console.log(category);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header label="Guardos"
              leftIcon={<Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />} />
      <StatusBar barStyle="dark-content" />

      {pictures.length > 0 && (
        <View style={styles.container}>
          <Image source={{ uri: pictures[0] }} style={styles.image} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => removePicture(pictures[0])} style={styles.deleteButton}>
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={changePicture} style={styles.changeButton}>
              <Text>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}



      <View style={styles.contentContainer}>
        <View style={styles.column}>
          <View style={styles.inputPair}>
            <Text style={styles.label}>Dish name</Text>
            <TextInput
              style={styles.input}
              placeholder="Dish name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={(text) => setPrice(text)} // check what happens if text is not a number
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline
            />
          </View>
        </View>
      </View>

      <View style={styles.contentProducsDishes}>
        <Text style={styles.label}>Products</Text>
        <View style={styles.containerAllergens}>
          {selectedProducts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => onProductPress(item)}
            >
              <Text style={styles.inputDishProduct}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          key={"ADDNEW"}
          style={styles.button}
          onPress={() => onAddProduct()}>
          <Text style={styles.labelCernterd}>{'Add new product'}</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.contentProducsDishes}>
        <Text style={styles.label}>Allergens</Text>
        <View style={styles.containerAllergens}>
          {selectedAllergens.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => onAllergenPress(item)}
            >
              <Text style={styles.inputDishProduct}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          key={"ADDNEWAllergens"}
          style={styles.button}
          onPress={() => onAddAllergen()}>
          <Text style={styles.labelCernterd}>{'Add new allergens'}</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.contentProducsDishes}>
        <Text style={styles.label}>Food Category</Text>
        <View style={styles.containerAllergens}>
          {selectedCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => onCategoryPress(item)}
            >
              <Text style={styles.inputDishProduct}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          key={"ADDNEWCATEGORY"}
          style={styles.button}
          onPress={() => onAddCategory()}>
          <Text style={styles.labelCernterd}>{'Add new category'}</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.contentProducsDishes}>
        <Text style={styles.label}>Restaurant</Text>
        <View style={styles.containerAllergens}>
          {selectedRestaurants.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => onRestaurantPress(item)}
            >
              <Text style={styles.inputDishProduct}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          key={"ADDNEW"}
          style={styles.button}
          onPress={() => onAddRestaurant()}>
          <Text style={styles.labelCernterd}>{'Add new restaurant'}</Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>{modalContentType}</Text>
            <View style={styles.flexContainer}>
              {modalContentType === 'Products' &&
                products.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, selectedProducts.includes(item) ? styles.selectedButton : null]}
                    onPress={() => toggleProductsSelection(item)}
                  >
                    <Text style={styles.inputDishProduct}>{item}</Text>
                  </TouchableOpacity>
                ))
              }
              {modalContentType === 'Allergens' &&
                allergens.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, selectedAllergens.includes(item) ? styles.selectedButton : null]}
                    onPress={() => toggleAllergensSelection(item)}
                  >
                    <Text style={styles.inputDishProduct}>{item}</Text>
                  </TouchableOpacity>
                ))
              }

              {modalContentType === 'Categories' &&
                category.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, selectedCategories.includes(item) ? styles.selectedButton : null]}
                    onPress={() => toggleCategoriesSelection(item)}
                  >
                    <Text style={styles.inputDishProduct}>{item}</Text>
                  </TouchableOpacity>
                ))
              }

              {modalContentType === 'Restaurants' &&
                restaurants.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, selectedRestaurants.includes(item) ? styles.selectedButton : null]}
                    onPress={() => toggleRestaurantsSelection(item)}
                  >
                    <Text style={styles.inputDishProduct}>{item}</Text>
                  </TouchableOpacity>
                ))
              }


            </View>
            <Button
              title="Close"
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>


    </ScrollView>
  );
};


export default EditDish;
