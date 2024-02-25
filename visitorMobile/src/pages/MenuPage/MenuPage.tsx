import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView} from 'react-native';
import styles from './MenuPage.styles';
import { getDishesByResto } from '../../services/dishCalls';
import {Dish} from '../../models/dishesInterfaces'

export  interface DishData {
  _id: number;
  dishes: Dish[];
}

const MenuPage: React.FC = ({ route }) => {
  const [dishesData, setDishesData] = useState<DishData[]>([]);
  const [loading, setLoading] = useState(true);
  const {restaurantId, restaurantName } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDishesByResto(restaurantName)        
        const data: DishData[] = await response.json();
        setDishesData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const menuGroupOrder = ['Appetizer', 'Maindish', 'Dessert'];

  const sortedDishes = dishesData[0]?.dishes.sort((a, b) => {
    const orderA = a.category.menuGroup ? menuGroupOrder.indexOf(a.category.menuGroup) : menuGroupOrder.length;
    const orderB = b.category.menuGroup ? menuGroupOrder.indexOf(b.category.menuGroup) : menuGroupOrder.length;
    return orderA - orderB;
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView} horizontal={false}>
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
                </View>
              </View>
            </React.Fragment>
          ))}
        </ScrollView>
      )}
    </View>
  );
  
};

export default MenuPage;