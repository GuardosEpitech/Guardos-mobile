import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert} from 'react-native';
import { ICategories, ICategory } from '../../../../shared/models/categoryInterfaces';
import { IRestaurantFrontEnd } from '../../../../shared/models/restaurantInterfaces';
import { getAllRestaurantsByUser, updateRestoCategories } from '../../services/restoCalls';
import { useTranslation } from 'react-i18next';
import styles from './AddCategories.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


const AddCategoryPage = () => {
    const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
    const [activeRestaurant, setActiveRestaurant] = useState<number>(-1);
    const [newCategories, setNewCategories] = useState<{ name: string; hitRate: number }[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryHitRate, setNewCategoryHitRate] = useState<number | ''>('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryNameError, setNewCategoryNameError] = useState(false);
    const [newCategoryHitRateError, setNewCategoryHitRateError] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const { t } = useTranslation();
    const scrollViewRef = useRef<ScrollView>(null);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | undefined>(undefined);

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                const restaurants = await getAllRestaurantsByUser({ key: userToken });
                setRestoData(restaurants);
                setActiveRestaurant(restaurants.length > 0 ? restaurants[0].uid : -1);
                updateNewCategories(restaurants.length > 0 ? restaurants[0].categories : []);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        }
        fetchDarkMode();
        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (showNewCategoryInput && scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [showNewCategoryInput]);


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
    

    const updateNewCategories = (categories: ICategories[]) => {
        const formattedCategories: { name: string; hitRate: number }[] = categories.map(category => ({
            name: category.name,
            hitRate: category.hitRate
        }));
        formattedCategories.sort((a, b) => a.hitRate - b.hitRate);
        setNewCategories(formattedCategories);
    };

    const handleRestaurantChange = async (value: string) => {
        const selectedRestaurantId = parseInt(value);
        setActiveRestaurant(selectedRestaurantId);
        const selectedRestaurant = restoData.find(restaurant => restaurant.uid === selectedRestaurantId);
        if (selectedRestaurant) {
            updateNewCategories(selectedRestaurant.categories.sort((a, b) => a.hitRate - b.hitRate));
        } else {
            setNewCategories([]);
        }
    };

    const handleAddNewCategory = () => {
        setShowNewCategoryInput(true);
    };

    const handleSaveCategory = async () => {
        if (newCategoryName.trim() === '' || newCategoryHitRate === '') {
            if (newCategoryName.trim() === '') {
                setNewCategoryNameError(true);
            }
            if (newCategoryHitRate === '') {
                setNewCategoryHitRateError(true);
            }
            return;
        }

        setNewCategoryNameError(false);
        setNewCategoryHitRateError(false);

        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken === null) {
            console.log("Error getting user ID");
            return;
        }

        const existingCategory = newCategories.find(category => category.name.toLowerCase() === newCategoryName.toLowerCase());
        if (existingCategory && !categoryToEdit) {
            return;
          }

        let updatedCategories = [...newCategories];
        if (categoryToEdit) {
            updatedCategories = updatedCategories.filter(
                category => !(category.name === categoryToEdit.name && category.hitRate === categoryToEdit.hitRate)
            );
          }

        const existingSortIdIndex = updatedCategories.findIndex(category => category.hitRate === Number(newCategoryHitRate));
        if (existingSortIdIndex !== -1 && !categoryToEdit) {
            updatedCategories = updatedCategories.map(category => {
              if (category.hitRate >= Number(newCategoryHitRate)) {
                return { ...category, hitRate: category.hitRate + 1 };
              }
              return category;
            });
          }

        const newHitRate = Number(newCategoryHitRate);

        if (categoryToEdit) {
          updatedCategories = updatedCategories.map(category => {
              if (category.hitRate > categoryToEdit.hitRate && category.hitRate <= newHitRate) {
                  return { ...category, hitRate: category.hitRate - 1 };
              } else if (category.hitRate < categoryToEdit.hitRate && category.hitRate >= newHitRate) {
                  return { ...category, hitRate: category.hitRate + 1 };
              }
              return category;
          });
        }

        const newCategory = { name: newCategoryName, hitRate: Number(newCategoryHitRate) };
        updatedCategories.push(newCategory);

        updatedCategories.sort((a, b) => a.hitRate - b.hitRate);
        const updatedResto = await updateRestoCategories(userToken, activeRestaurant, updatedCategories);
        const restaurants = await getAllRestaurantsByUser({ key: userToken });
        setRestoData(restaurants);
        setNewCategories(updatedCategories);
        setNewCategoryName('');
        setNewCategoryHitRate('');
        setShowNewCategoryInput(false);
        setCategoryToEdit(undefined);
    };

    const handleCancel = () => {
        setNewCategoryName('');
        setNewCategoryHitRate('');
        setCategoryToEdit(undefined);
        setShowNewCategoryInput(false);
    }

    const handleDeleteConfirmation = (category: ICategory) => {
        Alert.alert(
            t('pages.AddCategory.delete'),
            `${t('pages.AddCategory.deleteMessage')} ${category.name} ?`,
            [
                {
                    text: t('common.cancel'),
                    onPress: () => console.log("Deleted category"),
                    style: 'cancel',
                },
                {
                    text: t('common.confirm'),
                    onPress: () => {handleConfirmDelete(category)},
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };
    
      const handleConfirmDelete = async (categoryDelete: ICategory) => {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken === null) {
            console.log("Error getting user ID");
            return;
        }

        let updatedCategories = [...newCategories];
        if (categoryDelete) {
            updatedCategories = updatedCategories.filter(
                category => !(category.name === categoryDelete.name && category.hitRate === categoryDelete.hitRate)
            );
        }
        updatedCategories = updatedCategories.map(category => {
            if (category.hitRate > categoryDelete?.hitRate) {
                return { ...category, hitRate: category.hitRate - 1 };
            }
            return category;
        });

        updatedCategories.sort((a, b) => a.hitRate - b.hitRate);
        const updatedResto = await updateRestoCategories(userToken, activeRestaurant, updatedCategories);
        setNewCategories(updatedCategories);
    };

      const handleEditCategory = (category: ICategory) => {
        setCategoryToEdit(category);
        setNewCategoryName(category.name);
        setNewCategoryHitRate(category.hitRate);
        setShowNewCategoryInput(true);
      };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
        <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
            {restoData.length === 0 ? (
                <View style={styles.centered}>
                <Text style={[styles.ErrorMsg, darkMode && styles.darkModeTxt]}>{t('pages.AddCategory.noresto')}</Text> 
                </View>
            ) : (
                <>
            <View style={[styles.dropdownContainer, darkMode && styles.dropdownContainerDarkTheme]}>
                <DropDownPicker
                    items={restoData.map(restaurant => ({label: restaurant.name, value: restaurant.uid}))}
                    dropDownDirection={'BOTTOM'}
                    open={showPicker}
                    value={activeRestaurant}
                    setOpen={setShowPicker}
                    setValue={setActiveRestaurant}
                    onSelectItem={(item) => {handleRestaurantChange(item.value.toString());}}
                    multiple={false}
                    dropDownContainerStyle={{backgroundColor: darkMode ? '#181A1B' : 'white'}}
                    style={{ width: 'auto', marginLeft: 5, marginRight: 5, backgroundColor: darkMode ? '#181A1B' : 'white' }}
                    textStyle={{ fontSize: 16, color: darkMode ? 'white' : 'black' }}
                />
            </View>
            {newCategories.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={[styles.ErrorMsg, darkMode && styles.darkModeTxt]}>{t('pages.AddCategory.noCategory')}</Text> 
                    <Text style={[styles.ErrorMsg, darkMode && styles.darkModeTxt]}>{t('pages.AddCategory.noCategory2')}</Text> 
                </View>
            ) : (
            <ScrollView style={[styles.scrollContainer, darkMode && styles.scrollContainerDarkTheme]} ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={[styles.categoryContainers, darkMode && styles.categoryContainersDarkTheme]}>
                    {activeRestaurant !== -1 && (
                        <View style={{ width: '100%' }}>
                            {newCategories.map((category, index) => (
                                <View key={index} style={[styles.categoryItemContainer, darkMode && styles.categoryItemContainerDarkTheme]}>
                                    <Text style={[styles.categoryName, darkMode && styles.categoryNameDarkTheme]}>{t('pages.AddCategory.name')} {category.name}</Text>
                                    <Text style={[styles.categoryHitRate, darkMode && styles.categoryHitRateDarkTheme]}>{t('pages.AddCategory.id')} {category.hitRate}</Text>
                                    <TouchableOpacity onPress={() => {handleEditCategory(category)}} style={styles.iconButton}>
                                        <FontAwesomeIcon icon={faPen} size={15} color="gray" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {handleDeleteConfirmation(category)}} style={styles.iconButton}>
                                        <FontAwesomeIcon icon={faTrash} size={15} color="gray" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {showNewCategoryInput && (
                                <View style={styles.categoryItemContainer}>
                                    <TextInput
                                        placeholder={t('pages.AddCategory.name')}
                                        value={newCategoryName}
                                        onChangeText={(text) => {
                                            setNewCategoryName(text);
                                            setNewCategoryNameError(false);
                                        }}
                                        style={[styles.input, { borderColor: newCategoryNameError ? 'red' : 'black' }]}
                                    />
                                    <TextInput
                                        placeholder={t('pages.AddCategory.id')}
                                        value={newCategoryHitRate.toString()}
                                        onChangeText={(text) => {
                                            if (text === '') {
                                                setNewCategoryHitRate('');  // Allow clearing the input
                                                setNewCategoryHitRateError(false);  // No error if input is empty
                                            } else {
                                                const numericValue = parseInt(text);
                                                if (!isNaN(numericValue) && numericValue > 0) {
                                                    setNewCategoryHitRate(numericValue);
                                                    setNewCategoryHitRateError(false);  // Clear error for valid input
                                                } else {
                                                    setNewCategoryHitRateError(true);  // Set error for invalid input
                                                }
                                            }
                                        }}
                                        keyboardType="numeric"
                                        style={[styles.input, { borderColor: newCategoryHitRateError ? 'red' : 'black' }]}
                                    />
                                    <View style={styles.buttonContainer}>
                                        <Button title={t('common.save')} onPress={handleSaveCategory} />
                                        <Button title={t('common.cancel')} onPress={handleCancel} />
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
            )}
            <View style={styles.addButtonContainer}>
                <Button title={t('pages.AddCategory.add')} onPress={handleAddNewCategory} />
            </View>
            </>
        )}
        </View>
        </KeyboardAvoidingView>
    );
};

export default AddCategoryPage;
