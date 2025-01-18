import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView, Image } from 'react-native';
import DropDownPicker, {LanguageType} from 'react-native-dropdown-picker';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './EditRestaurant.styles';
import * as ImagePicker from "expo-image-picker";
import { defaultRestoImage } from "../../assets/placeholderImagesBase64";
import { addImageResto, deleteImageRestaurant, getImages } from "../../services/imagesCalls";
import {
  editResto,
  getAllMenuDesigns,
  getAllRestaurantChainsByUser,
  getAllRestaurantsByUser,
  getRestoByID
} from '../../services/restoCalls';
import { IMenuDesigns } from 'src/models/menuDesignsInterface'
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

DropDownPicker.addTranslation("DE", {
  PLACEHOLDER: "Wählen Sie ein Element aus",
  SEARCH_PLACEHOLDER: "Suche...",
  SELECTED_ITEMS_COUNT_TEXT: "{count} Elemente ausgewählt",
  NOTHING_TO_SHOW: "Es gibt nichts zu zeigen!"
});

DropDownPicker.addTranslation("FR", {
  PLACEHOLDER: "Sélectionnez un élément",
  SEARCH_PLACEHOLDER: "Tapez quelque chose...",
  SELECTED_ITEMS_COUNT_TEXT: "{count} éléments ont été sélectionnés",
  NOTHING_TO_SHOW: "Il n'y a rien à montrer!"
});

const EditRestaurant = ({ route }) => {
  const { restaurantId } = route.params; 
  const [name, setName] = useState('');
  const [originalRestoName, setOriginalRestoName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [picturesId, setPicturesId] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [menuDesigns, setMenuDesigns] = useState<IMenuDesigns[]>([]);
  const [selectedMenuDesign, setSelectedMenuDesign] = useState('');
  const [selectedMenuDesignID, setSelectedMenuDesignID] = useState(0);
  const [restoChains, setRestoChains] = useState<{uid: number, name: string}[]>([]);
  const [valueRestoChain, setValueRestoChain] = useState(null);
  const [selectedRestoChainId, setSelectedRestoChainId] = useState(null);
  const [inputValueRestoChain, setInputValueRestoChain] = React.useState("");
  const [restoChainID, setRestoChainID] = React.useState(undefined);
  const [menuDesignOpen, setMenuDesignOpen] = useState(false);
  const [restoChainOpen, setRestoChainOpen] = useState(false);
  const [allUserRestos, setAllUserRestos] = useState<string[]>([]);
  const [language, setLanguage] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const data = await getRestoByID(restaurantId);
        setName(data.name);
        setOriginalRestoName(data.name);
        setPhoneNumber(data.phoneNumber);
        setWebsite(data.website);
        setDescription(data.description);
        setStreetName(data.location.streetName);
        setStreetNumber(data.location.streetNumber);
        setPostalCode(data.location.postalCode);
        setCity(data.location.city);
        setCountry(data.location.country);
        setPicturesId(data.picturesId);
        setPictures(data.pictures);
        setSelectedMenuDesignID(data.menuDesignID);
        setSelectedMenuDesign(data.menuDesignID);
        setRestoChainID(data.restoChainID);

        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken === null) {
          return;
        }

        getAllRestaurantsByUser({ key: userToken }).then((res) => {
          setAllUserRestos(res.map((resto: {name: string}) => resto.name));
        })
        const res = await getAllRestaurantChainsByUser(userToken);
        setRestoChains(res);
        if (data.restoChainID !== undefined) {
          setValueRestoChain(res.find((restoChain:{uid:number, name:string}) => restoChain.uid === data.restoChainID).uid);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };
    fetchRestaurantData();
    catchMenuDesigns();
    setLanguage(i18n.language);
    fetchDarkMode();
  }, [restaurantId]);

  useEffect(() => {
    const loadImages = async () => {
      if (picturesId.length > 0) {
        try {
          const answer = await getImages(picturesId);
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
            base64: defaultRestoImage,
            contentType: "image/png",
            filename: "placeholder.png",
            size: 0,
            uploadDate: "",
            id: 0,
          }]);
        }
      } else {
        setPictures([{
          base64: defaultRestoImage,
          contentType: "image/png",
          filename: "placeholder.png",
          size: 0,
          uploadDate: "",
          id: 0,
        }]);
      }
    };

    loadImages();
  }, [picturesId]);

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

  const catchMenuDesigns = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }
    getAllMenuDesigns(userToken)
      .then((res) => {
        setMenuDesigns(res);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
  }

  const removePicture = (pictureUrl: string) => {
    if (picturesId.length > 0) {
      deleteImageRestaurant(picturesId[0], name);
      setPictures([{
        base64: defaultRestoImage,
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
        await addImageResto(restaurantId,
            asset.fileName, asset.mimeType, asset.fileSize, base64).then(
          r => {
            setPictures([{ base64: base64, contentType: asset.mimeType,
              filename: asset.fileName, size: asset.fileSize, uploadDate: "0", id: r }]);
            if (picturesId.length > 0) {
              deleteImageRestaurant(picturesId[0], name);
              picturesId.shift();
            }
            picturesId.push(r);
          }

        )
      }
    }
  };

  const handleSave = async () => {
    if (!name || !streetName || !streetNumber || !postalCode || !city || !country) {
      Alert.alert(String(t('common.error')), String(t('common.some-fields-mandatory')));
      return;
    }

    if (allUserRestos.includes(name) && name !== originalRestoName) {
      Alert.alert(String(t('common.error')), String(t('pages.AddEditRestaurantScreen.resto-name-taken')));
      return;
    }

    try {
      const updatedData = {
        name: name,
        phoneNumber: phoneNumber,
        description: description,
        website: website,
        openingHours: [],
        location: {
          streetName: streetName,
          streetNumber: streetNumber,
          postalCode: postalCode,
          city: city,
          country: country,
          latitude: "0",
          longitude: "0"
        },
        menuDesignID: selectedMenuDesignID,
        ...((selectedRestoChainId != null) && { restoChainID: selectedRestoChainId }),
        picturesId: picturesId,
      };

      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
        return;
      }

      const response = await editResto(restaurantId, updatedData, userToken);

      if (response) {
        Alert.alert(String(t('common.success')), String(t('pages.EditRestaurant.updated-resto-success')), [
          {
            text: String(t('common.ok')),
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert(String(t('common.error')), String(t('pages.EditReastaurant.updated-resto-failure')));
      }
    } catch (error) {
      console.error('Error updating restaurant data:', error);
      Alert.alert(String(t('common.error')), String(t('common.unexpected-error')));
    }
  };

  return (
    <ScrollView contentContainerStyle={darkMode ? styles.containerDark : styles.container}>
      <Header label="Guardos" leftIcon={<Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />} />
      <StatusBar barStyle="dark-content" />


      {
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
        )
      }





      <View style={darkMode ? styles.contentContainerDark : styles.contentContainer}>
        <View style={styles.column}>
          <View style={styles.inputPair}>
            <TextInput
              style={darkMode ? styles.inputDark : styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.resto-name-mandatory') as string}
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={darkMode ? styles.inputDark : styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.phone-number') as string}
              placeholderTextColor={darkMode ? 'white' : 'black'}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View>
          <View style={styles.inputPair}>
            <TextInput
              style={darkMode ? styles.inputDark : styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.website') as string}
              placeholderTextColor={darkMode ? 'white' : 'black'}
              value={website}
              onChangeText={(text) => setWebsite(text)}
            />
            <TextInput
              style={[darkMode ? styles.inputDark : styles.input, styles.multilineInput]}
              placeholder={t('pages.AddEditRestaurantScreen.description') as string}
              placeholderTextColor={darkMode ? 'white' : 'black'}
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline
            />
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.inputPair}>
            <TextInput
              style={darkMode ? styles.inputDark : styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.street-name-mandatory') as string}
              value={streetName}
              onChangeText={(text) => setStreetName(text)}
            />
            <TextInput
              style={darkMode ? styles.inputDark : styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.street-number-mandatory') as string}
              value={streetNumber}
              onChangeText={(text) => setStreetNumber(text)}
            />
          </View>
          <View style={styles.inputPair}>
            <TextInput
              style={darkMode ? styles.inputDark : styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.postal-code-mandatory') as string}
              value={postalCode}
              onChangeText={(text) => setPostalCode(text)}
            />
            <TextInput
              style={darkMode ? styles.inputDark : styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.city-mandatory') as string}
              value={city}
              onChangeText={(text) => setCity(text)}
            />
          </View>
          <View style={styles.inputPair}>
            <TextInput
              style={darkMode ? styles.inputDark : styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.country-mandatory') as string}
              value={country}
              onChangeText={(text) => setCountry(text)}
            />
          </View>
        </View>
      </View>
      <View style={darkMode ? styles.containerPickerDark : styles.containerPicker}>
        <DropDownPicker
          open={menuDesignOpen}
          language={language.toUpperCase() as LanguageType}
          items={menuDesigns.map((menuDesign) => ({ label: menuDesign.name, value: menuDesign._id }))}
          value={selectedMenuDesign}
          dropDownDirection={'TOP'}
          setOpen={setMenuDesignOpen}
          onChangeValue={(item:any) => {
            if (item === null || item === undefined || item === '' || typeof item === "undefined") {
              return;
            }
            setSelectedMenuDesign(item);
            setSelectedMenuDesignID(item);
          }}
          setValue={setSelectedMenuDesign}
          style={darkMode ? styles.pickerStylesDark : styles.pickerStyles}
          textStyle={darkMode ? styles.darkDropDownText : styles.dropDownText}
          dropDownContainerStyle={darkMode ? styles.dropDownContainerDark : styles.dropDownContainer}
        />
      </View>
      <View style={darkMode ? styles.containerPickerDark : styles.containerPicker}>
        <DropDownPicker
          open={restoChainOpen}
          language={language.toUpperCase() as LanguageType}
          items={restoChains.map((restoChain) => ({ label: restoChain.name, value: restoChain.uid }))}
          value={valueRestoChain}
          dropDownDirection={'TOP'}
          setOpen={setRestoChainOpen}
          onChangeValue={(item:any) => {
            if (item === null || item === undefined || item === '' || typeof item === "undefined") {
              return;
            };
            setValueRestoChain(item);
            setSelectedRestoChainId(item);
          }}
          setValue={setValueRestoChain}
          style={darkMode ? styles.pickerStylesDark : styles.pickerStyles}
          textStyle={darkMode ? styles.darkDropDownText : styles.dropDownText}
          dropDownContainerStyle={darkMode ? styles.dropDownContainerDark : styles.dropDownContainer}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>{t('common.save')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditRestaurant;
