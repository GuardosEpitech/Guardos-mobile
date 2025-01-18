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
import DropDownPicker, {LanguageType} from 'react-native-dropdown-picker';
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getProductsByUser } from "../../services/productCalls";
import { getAllRestaurantsByUser, getRestaurantByName, getAllRestaurantChainsByUser } from "../../services/restoCalls";
import * as ImagePicker from 'expo-image-picker';
import {addDish, changeDishByName, deleteDishByName, getDishesByUser} from "../../services/dishCalls";
import { IDishFE } from "../../../../shared/models/dishInterfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addImageDish,
  deleteImageDish,
  getImages
} from "../../services/imagesCalls";
import {  defaultDishImage } from "../../assets/placeholderImagesBase64";
import {useTranslation} from "react-i18next";


const EditDish = ({ route }) => {
  const { restaurantName } = route.params;
  const [editMode] = useState(!!route.params.dish);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [validTill, setValidTill] = useState('');
  const [pictures, setPictures] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [products, setProducts] = useState([]);
  const [pictureId, setPictureId] = useState([]);
  const [category, setCategory] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentType, setModalContentType] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [originalRestaurants, setOriginalRestaurants] = useState([]);
  const [restoChains, setRestoChains] = useState<{uid: number, name: string, restos: string[]}[]>([]);
  const [valueRestoChain, setValueRestoChain] = useState(null);
  const [selectedRestoChainId, setSelectedRestoChainId] = useState<number>(-1);
  const [inputValueRestoChain, setInputValueRestoChain] = React.useState("");
  const [restoChainID, setRestoChainID] = React.useState(undefined);
  const [restoChainOpen, setRestoChainOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [allUserDishes, setAllUserDishes] = useState<string[]>([]);
  const [originalName, setOriginalName] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState('');
  const {t, i18n} = useTranslation();
  
  useEffect(() => {
    setLanguage(i18n.language);
    fetchDarkMode();
    fetchRestoChains();

    AsyncStorage.getItem('userToken').then((userToken) => {
      getDishesByUser(userToken).then((res) => {
        setAllUserDishes(res.map((dish: {name: string}) => dish.name));
      })
    });
  }, []);


  const fetchDarkMode = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem('DarkMode');
      if (darkModeValue !== null) {
        const isDarkMode = darkModeValue === 'true';
        setDarkMode(isDarkMode);
      }
    } catch (error) {
      console.error('Error fetching dark mode value:', error);
    }
  };

  const fetchRestoChains = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }
    getAllRestaurantsByUser({key: userToken})
      .then(async (res) => {
        getAllRestaurantChainsByUser(userToken)
          .then(async (restoChainsRes) => {
            const chains = restoChainsRes.map((chain: {uid: number, name: string}) => ({
              uid: chain.uid,
              name: chain.name,
              restos: res.filter((resto: any) => resto.restoChainID === chain.uid)
                .map((resto: any) => resto.name),
            }));
            setRestoChains(chains);
            if (route.params.dish.restoChainID != -1) {
              setValueRestoChain(route.params.dish.restoChainID);
            }
          });

        const allDishRestos = res
          .filter((item: any) => item.dishes
            .some((dish: any) => dish.name === route.params.dish.name))
          .map((item: any) => item.name);
        setSelectedRestaurants(allDishRestos);
        await updateCategories(allDishRestos);
        setOriginalRestaurants(allDishRestos.map((resto: string) => resto));
      })
  };

  const onProductPress = (item: string) => {
    const updatedProducts = selectedProducts.filter(product => product !== item);
    setSelectedProducts(updatedProducts);
  };

  const onRestaurantPress = async (item: string) => {
    const updatedRestaurants = selectedRestaurants.filter(restaurant => restaurant !== item);
    setSelectedRestaurants(updatedRestaurants);
    await updateCategories(updatedRestaurants);
  }

  const onAddProduct = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const allProducts = await getProductsByUser(userToken);
    //@ts-ignore
    const newProducts = allProducts.filter(prod => !products.includes(prod.name)).map(prod => prod.name);
    setProducts([...products, ...newProducts]);

    setModalContentType(t('common.products') as string);
    setModalVisible(true);
  };

  const updateCategories = async (selectedRestos?: string []) => {
    let categories: string[] = [];
    for (const restaurantName of (selectedRestos ?? selectedRestaurants)) {
      const restaurant = await getRestaurantByName(restaurantName);
      if (restaurant && restaurant.categories) {
        categories = [...categories, ...restaurant.categories];
      }
    }

    //@ts-ignore
    const newCategories = categories.filter(cat => !categories.includes(cat.name)).map(cat => cat.name);
    const uniqueCategories = Array.from(new Set(newCategories));
    setCategory(uniqueCategories);
  };

  const onAddRestaurant = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const allRestaurants = await getAllRestaurantsByUser({key: userToken});
    //@ts-ignore
    const newRestaurants = allRestaurants.filter(resto => !restaurants.includes(resto.name)).map(resto => resto.name);
    setRestaurants([...restaurants, ...newRestaurants]);

    setModalContentType(t('common.restos') as string);
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

  const toggleRestaurantsSelection = async (item: string) => {
    let updatedSelectedRestaurants = [];
    if (selectedRestaurants.includes(item)) {
      updatedSelectedRestaurants = selectedRestaurants.filter(selectedItem => selectedItem !== item);
    } else {
      updatedSelectedRestaurants = [...selectedRestaurants, item];
    }
    setSelectedRestaurants(updatedSelectedRestaurants);
    await updateCategories(updatedSelectedRestaurants);
  }

  useEffect(() => {
    const loadImages = async () => {
      if (pictureId.length > 0) {
        try {
          const answer = await getImages(pictureId);
          // @ts-ignore
          setPictures(answer.map((img) => ({
            base64: img.base64,
            contentType: img.contentType,
            filename: img.filename,
            size: img.size,
            uploadDate: img.uploadDate,
            id: img.id,
          })));
        } catch (error) {
          console.error("Failed to load images", error);
          setPictures([{
            base64: defaultDishImage,
            contentType: "image/png",
            filename: "placeholder.png",
            size: 0,
            uploadDate: "",
            id: 0,
          }]);
        }
      } else {
        setPictures([{
          base64: defaultDishImage,
          contentType: "image/png",
          filename: "placeholder.png",
          size: 0,
          uploadDate: "",
          id: 0,
        }]);
      }
    };

    loadImages();
  }, [pictureId]);

  const removePicture = (pictureUrl: string) => {
    if (pictureId.length > 0) {
      deleteImageDish(pictureId[0],restaurantName ,name);
      setPictures([{
        base64: defaultDishImage,
        contentType: "png",
        filename: "placeholderResto.png",
        size: 0,
        uploadDate: "0",
        id: 0,
      }]);
    }
  };

  const changePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert(t('common.need-cam-permissions'));
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const base64 = 'data:' + asset.mimeType + ';base64,' + asset.base64;
        await addImageDish(restaurantName, name, asset.fileName, asset.mimeType, asset.fileSize, base64).then(
          r => {
            setPictures([{ base64: base64, contentType: asset.mimeType,
              filename: asset.fileName, size: asset.fileSize, uploadDate: "0", id: r }]);
            if (pictureId.length > 0) {
              deleteImageDish(pictureId[0],restaurantName ,name);
              pictureId.shift();
            }
            pictureId.push(r);
          }

        )
      }
    }
  };

  useEffect(() => {
    try {
      const allergens = ["No Allergens", "Celery", "Gluten",
        "Crustaceans", "Eggs", "Fish", "Lupin", "Milk", "Molluscs", "Mustard",
        "Nuts", "Peanuts", "Sesame seeds", "Soya", "Sulphur dioxide", "Lactose"];

      const category = route.params.dish.category.menuGroup;
      setOriginalName(route.params.dish.name);
      setName(route.params.dish.name);
      setPrice(route.params.dish.price.toString());
      setDescription(route.params.dish.description);
      setValidTill(route.params.dish.validTill);
      setPictures(route.params.dish.pictures);
      setPictureId(route.params.dish.picturesId);
      setAllergens(allergens);
      setSelectedCategory(category);
      setProducts(route.params.dish.products);
      setSelectedProducts(route.params.dish.products);
      setSelectedAllergens(route.params.dish.allergens);
      setSelectedRestoChainId(route.params.dish.restoChainID ?? -1);
      setSelectedRestaurants([restaurantName]);
    } catch (error) {
      console.error('Error fetching dish data:', error);
    }
  }, []);

  const handleSave = async () => {
    // check if valid
    if (!name || !price || selectedProducts.length === 0 || !selectedCategory || selectedRestaurants.length === 0) {
      Alert.alert(String(t('common.error')),  String(t('common.some-fields-mandatory')));
      return;
    }

    if (allUserDishes.includes(name) && name !== originalName) {
      Alert.alert(String(t('common.error')), String(t('pages.EditDishScreen.dish-name-exists')));
      return;
    }

    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }

    for (let i = 0; i < selectedRestaurants.length; i++) {
      const dishCategory = route.params.dish && route.params.dish.category ? route.params.dish.category : { menuGroup: '', foodGroup: '', extraGroup: [] };
      const dishToSave: IDishFE = {
        name: name,
        uid: route.params.dish ? route.params.dish.uid : -1,
        price: Number(price),
        description: description,
        allergens: selectedAllergens,
        products: selectedProducts,
        combo: route.params.dish ? route.params.dish.combo : [],
        category: {
          menuGroup: selectedCategory,
          foodGroup: dishCategory.foodGroup,
          extraGroup: dishCategory.extraGroup,
        },
        picturesId: pictureId,
        resto: selectedRestaurants[i],
        restoChainID: selectedRestoChainId,
        validTill: validTill,
        discount: route.params.dish ? route.params.dish.discount : null,
      };

      let dish = null;
      if (originalRestaurants.includes(selectedRestaurants[i])) {
        dish = await changeDishByName(dishToSave, selectedRestaurants[i], userToken, originalName);
        if (dish && dish.name) {
          console.log('Dish updated');
        }
      } else {
        const data = {
          resto: selectedRestaurants[i],
          dish: dishToSave,
          restoChainID: selectedRestoChainId
        };
        const newAddDish = await addDish(data, dishToSave.resto, userToken);
        if (newAddDish && newAddDish.name) {
          console.log('Dish saved');
        }
      }
      if (i === 0) {
        const deleteFromResto = originalRestaurants.filter((resto: any) => !selectedRestaurants.includes(resto));
        for (const resto of deleteFromResto) {
          await deleteDishByName(resto, originalName, userToken);
        }
      }
    }
    navigation.navigate('MyDishesScreen');
    return;
  };

  const changeSelectedRestoChain = (restoChainId: number) => {
    const previousRestoChain = selectedRestoChainId;
    let dishRestos = selectedRestaurants;

    if (previousRestoChain !== -1) {
      restoChains
        .filter((chain) => chain.uid === previousRestoChain)
        ?.forEach((chain) => chain.restos.forEach((resto) => {
          dishRestos = dishRestos.filter((restoName) => restoName !== resto);
        }));
    }
    if (restoChainId !== -1) {
      restoChains
        .filter((chain) => chain.uid === restoChainId)
        .forEach((chain) => {
          dishRestos.push(
            ...chain.restos.filter((resto) => !dishRestos.includes(resto))
          );
        });
    }
    if (previousRestoChain !== restoChainId) {
      setSelectedRestaurants(selectedRestaurants.filter((resto, index) => dishRestos.indexOf(resto) === index));
    }

    setSelectedRestoChainId(restoChainId);
    setValueRestoChain(restoChainId);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, darkMode && styles.containerDarkTheme]}>
      <Header label="Guardos"
              leftIcon={<Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />} />
      <StatusBar barStyle="dark-content" />

      { editMode && (
        pictures.length > 0 ? (
          <View style={styles.container}>
            <Image source={{ uri: pictures[0].base64}} style={styles.image} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => removePicture(pictures[0])} style={styles.deleteButton}>
                <Text>{t('common.delete')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={changePicture} style={styles.changeButton}>
                <Text>{t('common.change')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.centeredView}>
            <TouchableOpacity style={styles.imageContainer} onPress={changePicture}>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{t('common.add-picture')}</Text>
          </View>
            </TouchableOpacity>
          </View>
        ))
      }




      <View style={styles.contentContainer}>
        <View style={styles.column}>
          <View style={styles.inputPair}>

            <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{t('pages.EditDishScreen.dish-name')}</Text>
            <TextInput
              style={[styles.input, darkMode && styles.inputDarkTheme]}
              placeholder={t('pages.EditDishScreen.dish-name') as string}
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{t('pages.EditDishScreen.price')}</Text>
            <TextInput
              style={[styles.input, darkMode && styles.inputDarkTheme]}
              placeholder={t('pages.EditDishScreen.price') as string}
              value={price}
              onChangeText={(text) => setPrice(text)} // check what happens if text is not a number
            />

            <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{t('pages.EditDishScreen.description')}</Text>
            <TextInput
              style={[[styles.input, darkMode && styles.inputDarkTheme], styles.multilineInput]}
              placeholder={t('pages.EditDishScreen.description') as string}
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline
            />
          </View>
        </View>
      </View>

      <View style={styles.contentProducsDishes}>
        <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{t('pages.EditDishScreen.products')}</Text>
        <View style={styles.containerAllergens}>
          {selectedProducts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => onProductPress(item)}
            >
              <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          key={"ADDNEW"}
          style={styles.button}
          onPress={() => onAddProduct()}>
          <Text style={[styles.labelCernterd, darkMode && styles.labelCernterdDarkTheme]}>{t('pages.EditDishScreen.add-product')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentProducsDishes}>
        <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{t('pages.EditDishScreen.resto')}</Text>
        <View style={styles.containerAllergens}>
          {selectedRestaurants.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => onRestaurantPress(item)}
            >
              <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          key={"ADDNEW"}
          style={styles.button}
          onPress={() => onAddRestaurant()}>
          <Text style={[styles.labelCernterd, darkMode && styles.labelCernterdDarkTheme]}>{t('pages.EditDishScreen.add-resto')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentProducsDishes}>
        <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{t('pages.AddEditRestaurantScreen.select-resto-chain')}</Text>
        <DropDownPicker
          open={restoChainOpen}
          itemKey={valueRestoChain}
          language={language.toUpperCase() as LanguageType}
          items={[{label: "-", value: -1}, ...restoChains.map((restoChain) => ({ label: restoChain.name, value: restoChain.uid }))]}
          value={valueRestoChain}
          dropDownDirection={'TOP'}
          setOpen={setRestoChainOpen}
          onChangeValue={(item:any) => {
            if (item === null || item === undefined || item === '' || typeof item === "undefined") {
              return;
            };
            changeSelectedRestoChain(item);
          }}
          setValue={setValueRestoChain}
          style={darkMode ? styles.darkDropdown : styles.lightDropdown} // Dropdown container style
          dropDownContainerStyle={darkMode ? styles.darkDropDownContainer : styles.lightDropDownContainer} // Dropdown menu style
          textStyle={darkMode ? styles.darkDropdownText : styles.lightDropdownText} // Text style in dropdown
          placeholderStyle={darkMode ? styles.darkPlaceholder : styles.lightPlaceholder} // Placeholder style
          labelStyle={darkMode ? styles.darkLabel : styles.lightLabel} // Label text style
        />
        <Text style={styles.info}>{t('pages.EditDishScreen.resto-chain-info')}</Text>
      </View>

      <View key={"category-picker"} style={styles.contentProducsDishes}>
        <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{t('pages.EditDishScreen.food-category')}</Text>
        <DropDownPicker
          key={"category-picker2"}
          open={categoryOpen}
          itemKey={selectedCategory ?? 'category-placeholder'}
          language={language.toUpperCase() as LanguageType}
          items={category.map((cat) => ({label: cat, value: cat}))}
          value={selectedCategory}
          dropDownDirection={'TOP'}
          setOpen={setCategoryOpen}
          setValue={setSelectedCategory}
          style={darkMode ? styles.darkDropdown : styles.lightDropdown} // Dropdown container style
          dropDownContainerStyle={darkMode ? styles.darkDropDownContainer : styles.lightDropDownContainer} // Dropdown menu style
          textStyle={darkMode ? styles.darkDropdown : styles.lightDropdown} // Text style in dropdown
          placeholderStyle={darkMode ? styles.darkPlaceholder : styles.lightPlaceholder} // Placeholder style
          labelStyle={darkMode ? styles.darkLabel : styles.lightLabel} // Label text style
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>{t('common.save')}</Text>
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
          <View style={[styles.modalView, darkMode && styles.modalViewDark]}>
            <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{modalContentType}</Text>
            <View style={styles.flexContainer}>
              {modalContentType === t('common.products') &&
                products.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, selectedProducts.includes(item) ? styles.selectedButton : null]}
                    onPress={() => toggleProductsSelection(item)}
                  >
                    <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{item}</Text>
                  </TouchableOpacity>
                ))
              }
              {modalContentType === t('pages.EditDishScreen.allergens') &&
                allergens.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, selectedAllergens.includes(item) ? styles.selectedButton : null]}
                    onPress={() => toggleAllergensSelection(item)}
                  >
                    <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{item}</Text>
                  </TouchableOpacity>
                ))
              }

              {modalContentType === t('common.restos') &&
                restaurants.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, selectedRestaurants.includes(item) ? styles.selectedButton : null]}
                    onPress={() => toggleRestaurantsSelection(item)}
                  >
                    <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{item}</Text>
                  </TouchableOpacity>
                ))
              }


            </View>
            <Button
              title={t('common.close') as string}
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
