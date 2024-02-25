import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import styles from './MenuPage.styles';
import { getDishesByResto, deleteDishByName } from '../../services/dishCalls';
import { Dish } from 'src/models/dishesInterfaces';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export interface DishData {
  _id: number;
  dishes: Dish[];
}

const MenuPage: React.FC = ({ route }) => {
  const [dishesData, setDishesData] = useState<DishData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { restaurantId, restaurantName } = route.params;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getDishesByResto(restaurantName);
      const data: DishData[] = await response.json();
      setDishesData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const menuGroupOrder = ['Appetizer', 'Maindish', 'Dessert'];

  const sortedDishes = dishesData[0]?.dishes.sort((a, b) => {
    const orderA = a.category.menuGroup ? menuGroupOrder.indexOf(a.category.menuGroup) : menuGroupOrder.length;
    const orderB = b.category.menuGroup ? menuGroupOrder.indexOf(b.category.menuGroup) : menuGroupOrder.length;
    return orderA - orderB;
  });

  const handleDelete = (dish: Dish) => {
    setSelectedDish(dish);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (selectedDish) {
      await deleteDishByName(restaurantName, selectedDish.name);
      setShowConfirmation(false);
      fetchData();
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollView} horizontal={false} scrollEnabled={true}>
            {sortedDishes.map((dish, index) => (
              <React.Fragment key={dish.name}>
                {(index === 0 || sortedDishes[index - 1].category.menuGroup !== dish.category.menuGroup) && (
                  <Text style={styles.groupTitle}>{dish.category.menuGroup}</Text>
                )}
                <View style={styles.card}>
                  <Image source={{ uri: dish.pictures[0] }} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{dish.name}</Text>
                    <Text>{dish.description}</Text>
                    <Text>Price: ${dish.price}</Text>
                    <Text>Allergens: {dish.allergens.join(', ')}</Text>
                    <TouchableOpacity onPress={() => handleDelete(dish)} style={styles.deleteButton}>
                      <FontAwesomeIcon icon={faTrash} />
                    </TouchableOpacity>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </ScrollView>
          <Modal visible={showConfirmation} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>Are you sure you want to delete this dish?</Text>
                <View style={styles.modalButtons}>
                  <Button title="Cancel" onPress={() => setShowConfirmation(false)} />
                  <Button title="Delete" onPress={confirmDelete} />
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

export default MenuPage;
