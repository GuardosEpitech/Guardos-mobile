import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './EditRestaurant.styles';
import * as ImagePicker from "expo-image-picker";
import { defaultRestoImage } from "../../assets/placeholderImagesBase64";
import { addImageResto, deleteImageRestaurant, getImages } from "../../services/imagesCalls";
import { editResto, getAllMenuDesigns, getRestoByName } from '../../services/restoCalls';
import { IMenuDesigns } from 'src/models/menuDesignsInterface'
import {useTranslation} from "react-i18next";

const EditRestaurant = ({ route }) => {
  const { restaurantId } = route.params; 
  const [name, setName] = useState('');
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
  const [menuDesignOpen, setMenuDesignOpen] = useState(false);
  const navigation = useNavigation();
  const {t} = useTranslation();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const data = await getRestoByName(restaurantId);

        setName(data.name);
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
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurantData();

    getAllMenuDesigns()
      .then((res) => {
        setMenuDesigns(res);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
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
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        await addImageResto(name, 'restoImage', "image/png", result.assets.length, result.assets[0].uri).then(
          r => {
            setPictures([{ base64: result.assets[0].uri, contentType: "image/png",
              filename: 'restoImage', size: result.assets.length, uploadDate: "0", id: r }]);
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
      };

      const response = await editResto(name, updatedData);

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
    <ScrollView contentContainerStyle={styles.container}>
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





      <View style={styles.contentContainer}>
        <View style={styles.column}>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.resto-name-mandatory') as string}
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.phone-number') as string}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.website') as string}
              value={website}
              onChangeText={(text) => setWebsite(text)}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder={t('pages.AddEditRestaurantScreen.description') as string}
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline
            />
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.street-name-mandatory') as string}
              value={streetName}
              onChangeText={(text) => setStreetName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.street-number-mandatory') as string}
              value={streetNumber}
              onChangeText={(text) => setStreetNumber(text)}
            />
          </View>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.postal-code-mandatory') as string}
              value={postalCode}
              onChangeText={(text) => setPostalCode(text)}
            />
            <TextInput
              style={styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.city-mandatory') as string}
              value={city}
              onChangeText={(text) => setCity(text)}
            />
          </View>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder={t('pages.AddEditRestaurantScreen.country-mandatory') as string}
              value={country}
              onChangeText={(text) => setCountry(text)}
            />
          </View>
        </View>
      </View>
      <View style={styles.containerPicker}>
        <DropDownPicker
          open={menuDesignOpen}
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
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>{t('common.save')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditRestaurant;
