import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StatusBar, ScrollView } from 'react-native';
import DropDownPicker, {LanguageType} from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import styles from './AddRestaurantScreen.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addRestaurant,
  getAllMenuDesigns,
  restoByName,
  getAllRestaurantChainsByUser,
  getAllRestaurantsByUser
} from '../../services/restoCalls';
import { IMenuDesigns } from 'src/models/menuDesignsInterface';
import { CommonActions} from '@react-navigation/native';
import {useTranslation} from "react-i18next";
import {addQRCode} from "../../services/qrcodeCall";
import { TimePickerModal } from 'react-native-paper-dates';

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

const AddRestaurantScreen = () => {
  const navigation = useNavigation();
  const [restaurantName, setRestaurantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [menuDesigns, setMenuDesigns] = useState<IMenuDesigns[]>([]);
  const [selectedMenuDesign, setSelectedMenuDesign] = useState('');
  const [selectedMenuDesignID, setSelectedMenuDesignID] = useState(0);
  const [menuDesignOpen, setMenuDesignOpen] = useState(false);
  const [language, setLanguage] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [restoChains, setRestoChains] = useState<{uid: number, name: string}[]>([]);
  const [valueRestoChain, setValueRestoChain] = useState(null);
  const [selectedRestoChainId, setSelectedRestoChainId] = useState(null);
  const [inputValueRestoChain, setInputValueRestoChain] = React.useState("");
  const [restoChainID, setRestoChainID] = React.useState(0);
  const [restoChainOpen, setRestoChainOpen] = useState(false);
  const [allUserRestos, setAllUserRestos] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(false);
  const {t, i18n} = useTranslation();

  const days = [
    { id: 0, name: t('pages.AddEditRestaurantScreen.monday') },
    { id: 1, name: t('pages.AddEditRestaurantScreen.tuesday') },
    { id: 2, name: t('pages.AddEditRestaurantScreen.wednesday') },
    { id: 3, name: t('pages.AddEditRestaurantScreen.thursday') },
    { id: 4, name: t('pages.AddEditRestaurantScreen.friday') },
    { id: 5, name: t('pages.AddEditRestaurantScreen.saturday') },
    { id: 6, name: t('pages.AddEditRestaurantScreen.sunday') },
  ];
  const [openTimePicker, setOpenTimePicker] = React.useState({
    open: false,
    day: null,
    type: null,
    defaultTime: { hours: 12, minutes: 0 } // Default to 12:00
  });
  const [selectedOpeningHours, setSelectedOpeningHours] = React.useState([]);

  const addTimeOpen = ({ open, day }) => {
    setSelectedOpeningHours(prev => {
      const existingDay = prev.find(item => item.day === day);
      if (existingDay) {
        return prev.map(item =>
            item.day === day
                ? { ...item, open }
                : item
        );
      } else {
        return [...prev, { day, open, close: '' }];
      }
    });
  };

  const addTimeClose = ({ close, day }) => {
    setSelectedOpeningHours(prev => {
      const existingDay = prev.find(item => item.day === day);
      if (existingDay) {
        return prev.map(item =>
            item.day === day
                ? { ...item, close }
                : item
        );
      } else {
        return [...prev, { day, open: '', close }];
      }
    });
  };
  const handleConfirm = (time, day, type) => {
    if (time) {
      const formattedTime = time.minutes < 10 ? time.hours + ':0' + time.minutes : time.hours + ':' + time.minutes;
      if (type === 'open') {
        addTimeOpen({ open: formattedTime, day });
      } else if (type === 'close') {
        addTimeClose({ close: formattedTime, day });
      }
    } else {
      console.log('Invalid time selected');
    }
    setOpenTimePicker({ open: false, day: null, type: null });
  };
  useEffect(() => {
    catchAllMenuDesigns();
    setLanguage(i18n.language);
    fetchDarkMode();
    fetchRestoChains();

    AsyncStorage.getItem('userToken').then((userToken) => {
      getAllRestaurantsByUser({key: userToken}).then((res) => {
        setAllUserRestos(res.map((r: {name: string}) => r.name));
      });
    })
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

  const catchAllMenuDesigns = async () => {
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

  const fetchRestoChains = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }
    getAllRestaurantChainsByUser(userToken)
      .then((res) => {
        setRestoChains(res);
      });
  };

  const handleAddRestaurant = async () => {
    if (!restaurantName || !streetName || !streetNumber || !postalCode || !city || !country) {
      Alert.alert(String(t('common.error')), String(t('common.some-fields-mandatory')));
      return;
    }

    if (allUserRestos.includes(restaurantName)) {
      Alert.alert(String(t('common.error')), String(t('pages.AddEditRestaurantScreen.resto-name-taken')));
      return;
    }

    const restaurantData = {
      name: restaurantName,
      phoneNumber: phoneNumber,
      website: website,
      pictures: [imageURL],
      openingHours: selectedOpeningHours,
      location: {
        streetName: streetName,
        streetNumber: streetNumber,
        postalCode: postalCode,
        city: city,
        country: country,
        latitude: "0",
        longitude: "0",
      },
      description: description,
      menuDesignID: selectedMenuDesignID,
      ...((selectedRestoChainId != null) && { restoChainID: selectedRestoChainId }),
    };

    const token = await AsyncStorage.getItem('userToken');

    const data  = {
      userToken: token,
      resto: restaurantData,
    };
    try {
      const response = await addRestaurant(data);
      const res = await restoByName(restaurantName);
      await addQRCode({uid: res.uid,
        url: `https://guardos.eu/menu/${res.uid}`});
      setRestaurantName('');
      setPhoneNumber('');
      setStreetName('');
      setStreetNumber('');
      setPostalCode('');
      setCity('');
      setCountry('');
      setDescription('');
      setWebsite('');
      setImageURL('');
      setSelectedMenuDesignID(0);
      setSelectedMenuDesign('');
      setSelectedRestoChainId(null);
      setSelectedOpeningHours([]);
      refreshApp();
    } catch (error) {
      console.error('Error adding restaurant:', error);
      Alert.alert(String(t('common.error')), String(t('pages.AddEditRestaurantScreen.add-resto-failed')));
    }
  };

  const refreshApp = () => {
    setRefresh((prevRefresh) => !prevRefresh);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    );
  };

  return (
    <ScrollView style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <View style={styles.inputContainer}>
        <View style={styles.inputPair}>
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder={t('pages.AddEditRestaurantScreen.resto-name-mandatory') as string}
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
            value={restaurantName}
            onChangeText={setRestaurantName}
          />
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder={t('pages.AddEditRestaurantScreen.phone-number') as string}
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputPair}>
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder={t('pages.AddEditRestaurantScreen.street-name-mandatory') as string}
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
            value={streetName}
            onChangeText={setStreetName}
          />
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder={t('pages.AddEditRestaurantScreen.street-number-mandatory') as string}
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
            value={streetNumber}
            onChangeText={setStreetNumber}
          />
        </View>

        <View style={styles.inputPair}>
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder={t('pages.AddEditRestaurantScreen.postal-code-mandatory') as string}
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
            value={postalCode}
            onChangeText={setPostalCode}
          />
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder={t('pages.AddEditRestaurantScreen.city-mandatory') as string}
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.inputPair}>
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder={t('pages.AddEditRestaurantScreen.country-mandatory') as string}
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder={t('pages.AddEditRestaurantScreen.description') as string}
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.inputPair}>
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder={t('pages.AddEditRestaurantScreen.website') as string}
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
            value={website}
            onChangeText={setWebsite}
          />
        </View>
        <View>
          {days.map((index, key) => {
            const dayOpeningHours = selectedOpeningHours.find(item => item.day === index.id) || {};
            return (
                <View key={key} style={styles.dayContainer}>
                  <Text style={darkMode ? styles.darkModeDayText : styles.dayText}>{index.name}</Text>
                  <TouchableOpacity
                      style={styles.timeText}
                      onPress={() =>
                          setOpenTimePicker({
                            open: true,
                            day: index.id,
                            type: 'open',
                            defaultTime: dayOpeningHours.open
                                ? {
                                  hours: parseInt(dayOpeningHours.open.split(':')[0]),
                                  minutes: parseInt(dayOpeningHours.open.split(':')[1]),
                                }
                                : { hours: 9, minutes: 0 },
                          })
                      }
                  >
                    <Text style={styles.timeTextInside}>
                      {dayOpeningHours.open || t('pages.AddEditRestaurantScreen.opening-time')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.timeText}
                      onPress={() =>
                          setOpenTimePicker({
                            open: true,
                            day: index.id,
                            type: 'close',
                            defaultTime: dayOpeningHours.close
                                ? {
                                  hours: parseInt(dayOpeningHours.close.split(':')[0]),
                                  minutes: parseInt(dayOpeningHours.close.split(':')[1]),
                                }
                                : { hours: 23, minutes: 0 },
                          })
                      }
                  >
                    <Text style={styles.timeTextInside}>
                      {dayOpeningHours.close || t('pages.AddEditRestaurantScreen.closing-time')}
                    </Text>
                  </TouchableOpacity>
                </View>
            );
          })}
          <TimePickerModal
              visible={openTimePicker.open}
              onDismiss={() => setOpenTimePicker({ open: false, day: null, type: null })}
              onConfirm={(time) => handleConfirm(time, openTimePicker.day, openTimePicker.type)}
              label={
                openTimePicker.type === 'open'
                    ? t('pages.AddEditRestaurantScreen.opening-time')
                    : t('pages.AddEditRestaurantScreen.closing-time')
              }
              uppercase={false}
              hours={openTimePicker.defaultTime?.hours}
              minutes={openTimePicker.defaultTime?.minutes}
          />
        </View>
        <View style={styles.containerPicker}>
          <Text style={{ marginBottom: 5 }}>{t('pages.AddEditRestaurantScreen.select-menu-design')}</Text>
          <DropDownPicker
            open={menuDesignOpen}
            language={language.toUpperCase() as LanguageType}
            items={menuDesigns.map((menuDesign) => ({ label: menuDesign.name, value: menuDesign._id }))}
            value={selectedMenuDesign}
            dropDownDirection={'TOP'}
            setOpen={setMenuDesignOpen}
            onChangeValue={(item: any) => {
            if (item === null || item === undefined || item === '' || typeof item === "undefined") {
              return;
            }
            setSelectedMenuDesign(item);
            setSelectedMenuDesignID(item);
            }}
            setValue={setSelectedMenuDesign}
            style={darkMode ? styles.darkDropdown : styles.lightDropdown} // Dropdown container style
            dropDownContainerStyle={darkMode ? styles.darkDropDownContainer : styles.lightDropDownContainer} // Dropdown menu style
            textStyle={darkMode ? styles.darkDropdownText : styles.lightDropdownText} // Text style in dropdown
            placeholderStyle={darkMode ? styles.darkPlaceholder : styles.lightPlaceholder} // Placeholder style
            labelStyle={darkMode ? styles.darkLabel : styles.lightLabel} // Label text style
          />
        </View>
        <View style={styles.containerPicker}>
          <Text style={{ marginBottom: 5, paddingTop: 5 }}>{t('pages.AddEditRestaurantScreen.select-resto-chain')}</Text>
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
              }
              setValueRestoChain(item);
              setSelectedRestoChainId(item);
            }}
            setValue={setValueRestoChain}
            style={darkMode ? styles.darkDropdown : styles.lightDropdown} // Dropdown container style
            dropDownContainerStyle={darkMode ? styles.darkDropDownContainer : styles.lightDropDownContainer} // Dropdown menu style
            textStyle={darkMode ? styles.darkDropdownText : styles.lightDropdownText} // Text style in dropdown
            placeholderStyle={darkMode ? styles.darkPlaceholder : styles.lightPlaceholder} // Placeholder style
            labelStyle={darkMode ? styles.darkLabel : styles.lightLabel} // Label text style
          />
        </View>
      </View>
      <TouchableOpacity style={[styles.addButton, darkMode ? styles.darkAddButton : styles.lightAddButton]} onPress={handleAddRestaurant}>
        <Text style={styles.buttonText}>{t('pages.AddEditRestaurantScreen.add-resto')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddRestaurantScreen;
