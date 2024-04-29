import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import { ICategories } from '../../../../shared/models/categoryInterfaces';
import { IRestaurantFrontEnd } from '../../../../shared/models/restaurantInterfaces';
import { getAllRestaurantsByUser, updateRestoCategories } from '../../services/restoCalls';
import { useTranslation } from 'react-i18next';
import styles from './AddCategories.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';

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
        if (existingCategory) {
            return;
        }

        let updatedCategories = [...newCategories];

        const existingSortIdIndex = updatedCategories.findIndex(category => category.hitRate === Number(newCategoryHitRate));
        if (existingSortIdIndex !== -1) {
            updatedCategories = updatedCategories.map(category => {
                if (category.hitRate >= Number(newCategoryHitRate)) {
                    return { ...category, hitRate: category.hitRate + 1 };
                }
                return category;
            });
        }

        const newCategory = { name: newCategoryName, hitRate: Number(newCategoryHitRate) };
        updatedCategories.push(newCategory);

        updatedCategories.sort((a, b) => a.hitRate - b.hitRate);
        const updatedResto = await updateRestoCategories(userToken, activeRestaurant, updatedCategories);
        setNewCategories(updatedCategories);
        setNewCategoryName('');
        setNewCategoryHitRate('');
        setShowNewCategoryInput(false);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
        <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
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

            <ScrollView style={[styles.scrollContainer, darkMode && styles.scrollContainerDarkTheme]} ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={[styles.categoryContainers, darkMode && styles.categoryContainersDarkTheme]}>
                    {activeRestaurant !== -1 && (
                        <View style={{ width: '100%' }}>
                            {newCategories.map((category, index) => (
                                <View key={index} style={[styles.categoryItemContainer, darkMode && styles.categoryItemContainerDarkTheme]}>
                                    <Text style={[styles.categoryName, darkMode && styles.categoryNameDarkTheme]}>{t('pages.AddCategory.name')} {category.name}</Text>
                                    <Text style={[styles.categoryHitRate, darkMode && styles.categoryHitRateDarkTheme]}>{t('pages.AddCategory.id')} {category.hitRate}</Text>
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
                                            const numericValue = parseInt(text);
                                            if (!isNaN(numericValue) && numericValue > 0) {
                                                setNewCategoryHitRate(numericValue);
                                            }
                                            setNewCategoryHitRateError(isNaN(numericValue) || numericValue <= 0);
                                        }}
                                        keyboardType="numeric"
                                        style={[styles.input, { borderColor: newCategoryHitRateError ? 'red' : 'black' }]}
                                    />
                                    <Button title={t('common.save')} onPress={handleSaveCategory} />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
            
            <View style={styles.addButtonContainer}>
                <Button title={t('pages.AddCategory.add')} onPress={handleAddNewCategory} />
            </View>
        </View>
        </KeyboardAvoidingView>
    );
};

export default AddCategoryPage;
