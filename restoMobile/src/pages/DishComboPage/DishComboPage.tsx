import React, {useCallback, useEffect, useState} from "react";
import {
  Alert,
  Button,
  Modal, RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useTranslation } from "react-i18next";
import { getDishesByResto2, addCombo, removeCombo } from "../../services/dishCalls";
import { IDishFE } from "../../../../shared/models/dishInterfaces";
import styles from "./DishComboPage.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const DishComboPage: React.FC = () => {
  const route = useRoute();
  const { dish } = route.params as { dish: IDishFE };
  const { t } = useTranslation();
  const [dishes, setDishes] = useState<IDishFE[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<IDishFE[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentType, setModalContentType] = useState('');
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      const allDishes = await getDishesByResto2(dish.resto);
      const cleanedDishes = allDishes[0].dishes.filter(
        (d: IDishFE) => d.name !== dish.name
      );

      const selected: IDishFE[] = [];
      if (dish.combo && dish.combo.length > 0) {
        cleanedDishes.forEach((d: IDishFE) => {
          if (dish.combo.includes(d.uid)) {
            selected.push(d);
          }
        });
      }
      setDishes(cleanedDishes);
      setSelectedDishes(selected);
    };

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
    
    fetchDarkMode();
    fetchDishes();
  }, []);

  const handleSelectDish = (item: IDishFE) => {
    const updatedDishes = selectedDishes.filter(dishes => dishes.name !== item.name);
    setSelectedDishes(updatedDishes);
  }

  const onAddDish = async () => {
    setModalContentType(t('pages.DishComboPage.name') as string);
    setModalVisible(true);
  }

  const toggleDishesSelection = (item: IDishFE) => {
    if (selectedDishes.includes(item)) {
      setSelectedDishes(selectedDishes.filter(selectedItem => selectedItem.name !== item.name));
    } else {
      setSelectedDishes([...selectedDishes, item]);
    }
  }

  const handleSave = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    
    if (selectedDishes.length < 1) {
      const newDishes = await removeCombo(userToken, {restoName: dish.resto, dish: dish});

      Alert.alert('Success', 'Successfully removed combination.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MyDishesScreen'),
        },
      ]);
      
    } else {
      const selectedUids = selectedDishes.map((dish) => dish.uid);
      const newDishes = await addCombo(userToken, {restoName: dish.resto, dish: dish, combo: selectedUids});

      Alert.alert('Success', 'Successfully added combo.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MyDishesScreen'),
        },
      ]);
    }

  };

  const handleClear = () => {
    setSelectedDishes([]);
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    const fetchDishes = async () => {
      const allDishes = await getDishesByResto2(dish.resto);
      const cleanedDishes = allDishes[0].dishes.filter(
          (d: IDishFE) => d.name !== dish.name
      );

      const selected: IDishFE[] = [];
      if (dish.combo && dish.combo.length > 0) {
        cleanedDishes.forEach((d: IDishFE) => {
          if (dish.combo.includes(d.uid)) {
            selected.push(d);
          }
        });
      }
      setDishes(cleanedDishes);
      setSelectedDishes(selected);
    };

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

    fetchDarkMode();
    fetchDishes();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView style={[styles.container, darkMode && styles.containerDark]}
                contentContainerStyle={styles.scrollViewContentContainer}
                refreshControl={
                  <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
    }>
      <View style={[styles.container, darkMode && styles.containerDark]}>
        <Text style={[styles.title, darkMode && styles.titleDark]}>
          {t('pages.DishComboPage.title')} {dish.name}
        </Text>

        <Text style={[styles.label, darkMode && styles.labelDark]}>
          {t('pages.DishComboPage.recommendedCombinations')}
        </Text>

        <View style={styles.contentProducsDishes}>
          <View style={styles.containerAllergens}>
            {selectedDishes.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, darkMode && styles.buttonDark]}
                onPress={() => handleSelectDish(item)}
              >
                <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            key={"ADDNEW"}
            style={[styles.button, darkMode && styles.buttonDark]}
            onPress={() => onAddDish()}>
            <Text style={[styles.labelCernterd, darkMode && styles.labelCernterdDarkTheme]}>
              {t('pages.DishComboPage.add')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, darkMode && styles.saveButtonDark]}
            onPress={handleSave}
          >
            <Text style={[styles.saveButtonText, darkMode && styles.saveButtonTextDark]}>
              {t('pages.DishComboPage.save')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.clearButton, darkMode && styles.clearButtonDark]}
            onPress={handleClear}
          >
            <Text style={[styles.clearButtonText, darkMode && styles.clearButtonTextDark]}>
              {t('pages.DishComboPage.clearAll')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Section */}
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
            <Text style={[styles.label, darkMode && styles.labelDark]}>
              {modalContentType}
            </Text>
            <View style={styles.flexContainer}>
              {modalContentType === t('pages.DishComboPage.name') &&
                dishes.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      selectedDishes.includes(item)
                        ? styles.selectedButton
                        : null,
                      darkMode && styles.buttonDark,
                      darkMode && selectedDishes.includes(item) && styles.selectedButtonDark
                    ]}
                    onPress={() => toggleDishesSelection(item)}
                  >
                    <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
            <Button
              title={t('common.close') as string}
              onPress={() => {
                setModalVisible(false);
              }}
              color={darkMode ? '#fff' : '#000'} // Button text color depending on the mode
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default DishComboPage;
