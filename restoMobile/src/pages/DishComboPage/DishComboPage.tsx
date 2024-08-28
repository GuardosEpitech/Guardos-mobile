import React, { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { getDishesByResto2, addCombo, removeCombo } from "../../services/dishCalls";
import { IDishFE } from "../../../../shared/models/dishInterfaces";
import styles from "./DishComboPage.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';


interface IDishComboPageProps {
  dish: IDishFE;
}

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


  useEffect(() => {
    console.log(dish);
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

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>{t('pages.DishComboPage.title')} {dish.name}</Text>

      <Text style={styles.label}>{t('pages.DishComboPage.recommendedCombinations')}</Text>

      <View style={styles.contentProducsDishes}>
        <View style={styles.containerAllergens}>
          {selectedDishes.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => handleSelectDish(item)}
            >
              <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          key={"ADDNEW"}
          style={styles.button}
          onPress={() => onAddDish()}>
          <Text style={[styles.labelCernterd, darkMode && styles.labelCernterdDarkTheme]}>{t('pages.DishComboPage.close')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title={t('pages.DishComboPage.save')} onPress={handleSave} />
        <Button title={t('pages.DishComboPage.clearAll')} onPress={handleClear} />
      </View>
    </View>

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


              {modalContentType === t('pages.DishComboPage.name') &&
                dishes.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.button, selectedDishes.includes(item) ? styles.selectedButton : null]}
                    onPress={() => toggleDishesSelection(item)}
                  >
                    <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{item.name}</Text>
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

export default DishComboPage;
