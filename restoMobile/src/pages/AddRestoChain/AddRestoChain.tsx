import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
    RefreshControl
} from 'react-native';
import { getAllRestaurantChainsByUser } from '../../services/restoCalls';
import { addRestoChain, deleteRestoChain } from '../../services/userCalls';
import { useTranslation } from 'react-i18next';
import styles from './AddRestoChain.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm";


const AddRestoChain = () => {
  const [newRestoChain, setNewRestoChain] = useState<{name: string}[]>([]);
  const [newRestoChainName, setNewRestoChainName] = useState('');
  const [selectedRestoName, setSelectedRestoName] = useState('');
  const [showRestoChainInput, setShowRestoChainInput] = useState(false);
  const [newRestoChainNameError, setRestoChainNameError] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function fetchRestoChains() {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const restoChains = await getAllRestaurantChainsByUser(userToken);
        updateRestoChains(restoChains.length > 0 ? restoChains : []);
      } catch (error) {
        console.error('Error fetching resto chains:', error);
      }
    }
    fetchRestoChains();
    fetchDarkMode();
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

  const updateRestoChains = (restoChains: {name: string}[]) => {
    setNewRestoChain(restoChains);
  };

  const handleAddNewRestoChain = () => {
    setShowRestoChainInput(true);
  };

  const handleDeleteRestoChain = async () => {
    const name = selectedRestoName;
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const returnValue = await deleteRestoChain(userToken, name);

      if (returnValue) {
        const index = newRestoChain.findIndex(item => item.name === name);
        if (index !== -1) {
          setNewRestoChain([...newRestoChain.slice(0, index), ...newRestoChain.slice(index + 1)]);
        }
      }
      setShowRestoChainInput(false);
      setModalVisible(false);
    } catch (error) {
      console.error('Error fetching resto chains:', error);
    }
  };

  const handleSaveRestoChain = async () => {
      if (newRestoChainName.trim() === '') {
        if (newRestoChainName.trim() === '') {
          setRestoChainNameError(true);
        }
        return;
      }

      setRestoChainNameError(false);

      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
          console.log("Error getting user ID");
          return;
      }

      const existingRestoChains = newRestoChain.find(restoChain => restoChain.name.toLowerCase() === newRestoChainName.toLowerCase());
      if (existingRestoChains) {
        return;
      }

      let updatedRestoChain = [...newRestoChain];

      const newRestoChainRecord = { name: newRestoChainName};
      updatedRestoChain.push(newRestoChainRecord);

      // add resto chain
      const returnData = await addRestoChain(userToken, newRestoChainName);

      if (returnData) {
        setNewRestoChain(updatedRestoChain);
      }

      setNewRestoChainName('');
      setShowRestoChainInput(false);
    };

    const handleCancel = () => {
      setNewRestoChainName('');
      setRestoChainNameError(false);
      setShowRestoChainInput(false);
  }

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRestoName('');
  }

  const toggleModal = (restoName: string) => {
    setModalVisible(!isModalVisible);
    setSelectedRestoName(restoName);
  };
    const onRefresh2 = useCallback(() => {
        setIsRefreshing(true);
        fetchDarkMode();
        setTimeout(() => {
            async function fetchRestoChains() {
                try {
                    const userToken = await AsyncStorage.getItem('userToken');
                    const restoChains = await getAllRestaurantChainsByUser(userToken);
                    updateRestoChains(restoChains.length > 0 ? restoChains : []);
                } catch (error) {
                    console.error('Error fetching resto chains:', error);
                }
            }
            fetchRestoChains();
            setIsRefreshing(false);
        }, 2000);
    }, []);

    return (
        <ScrollView style={[{ backgroundColor: darkMode ? '#181A1B' : 'white' }]} 
        refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh2} />
        }>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
        <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
            {newRestoChain.length === 0 && !showRestoChainInput ? (
                <View style={styles.centered}>
                    <Text style={[styles.ErrorMsg, darkMode && styles.darkModeTxt]}>{t('pages.RestoChain.noChain')}</Text> 
                    <Text style={[styles.ErrorMsg, darkMode && styles.darkModeTxt]}>{t('pages.RestoChain.noChain2')}</Text> 
                </View>
            ) : (
            <ScrollView style={[styles.scrollContainer, darkMode && styles.scrollContainerDarkTheme]} ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={[styles.categoryContainers, darkMode && styles.categoryContainersDarkTheme]}>
                      <View style={{ width: '100%' }}>
                          {newRestoChain.map((restoChain, index) => (
                              <View key={index} style={[styles.categoryItemContainer, darkMode && styles.categoryItemContainerDarkTheme]}>
                                  <Text style={[styles.categoryName, darkMode && styles.categoryNameDarkTheme]}>{t('pages.RestoChain.name')} {restoChain.name}</Text>
                                  <TouchableOpacity onPress={() => toggleModal(restoChain.name)} style={styles.iconButton}>
                                      <FontAwesomeIcon icon={faTrash} size={15} color="gray" />
                                  </TouchableOpacity>
                              </View>
                          ))}
                          {showRestoChainInput && (
                              <View style={styles.categoryItemContainer}>
                                  <TextInput
                                      placeholder={t('pages.RestoChain.name')}
                                      placeholderTextColor={darkMode ? 'grey' : 'black'}
                                      value={newRestoChainName}
                                      onChangeText={(text) => {
                                          setNewRestoChainName(text);
                                          setRestoChainNameError(false);
                                      }}
                                      style={[styles.input, { borderColor: newRestoChainNameError ? 'red' : 'black' }]}
                                  />
                                  <View style={styles.buttonContainer}>
                                      <Button title={t('common.save')} onPress={handleSaveRestoChain} />
                                      <Button title={t('common.cancel')} onPress={handleCancel} />
                                  </View>
                              </View>
                          )}
                      </View>
                </View>
            </ScrollView>
            )}
            <View style={styles.addButtonContainer}>
                <Button title={t('pages.AddCategory.add')} onPress={handleAddNewRestoChain} />
            </View>
            <ModalConfirm
              objectType={t('pages.RestoChain.restoChain')}
              isVisible={isModalVisible}
              onConfirm={handleDeleteRestoChain}
              onCancel={closeModal}
            />
        </View>
        </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default AddRestoChain;
