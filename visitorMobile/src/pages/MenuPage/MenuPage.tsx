import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView} from 'react-native';
import styles from './MenuPage.styles';
import { getDishesByResto } from '../../services/dishCalls';
import {Dish} from '../../models/dishesInterfaces'
import { defaultDishImage } from "../../../assets/placeholderImagesBase64";
import { IimageInterface } from "../../models/imageInterface";
import { getImages } from "../../services/imageCalls";
import { NavigationProp, ParamListBase } from '@react-navigation/native';

export  interface DishData {
  _id: number;
  dishes: Dish[];
}

type MenuProps = {
  route: any;
  navigation: NavigationProp<ParamListBase>;
}

const MenuPage: React.FC<MenuProps> = ({ route, navigation }) => {
  const [dishesData, setDishesData] = useState<DishData[]>([]);
  const [loading, setLoading] = useState(true);
  const {restaurantId, restaurantName } = route.params;
  
  // useEffect(() => {
  //   const fetchData1 = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await getDishesByResto(restaurantName);
  //       const data: DishData[] = await response.json();
  //       setDishesData(data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     }
  //   };
  const [pictures, setPictures] = useState<IimageInterface[]>([]);

  useEffect(() => {
    fetchData();

    const unsubscribe = navigation.addListener('focus', fetchData);

    return unsubscribe;
  }, [restaurantName, navigation]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDishesByResto(restaurantName);
      const data: DishData[] = await response.json();

      const picturesId = data[0].dishes.reduce((acc, dish) => acc.concat(dish.picturesId), []);

      if (picturesId.length > 0) {
        const imagesResponse = await getImages(picturesId);
        const imagesData: IimageInterface[] = [];
        for (const image of imagesResponse) {
          imagesData.push(await image);
        }
        const imagesMap = imagesData.reduce((acc, image) => {
          // @ts-ignore
          acc[image._id] = image;
          return acc;
        }, {});

        // @ts-ignore
        setPictures(imagesMap);
        setDishesData(data);
      } else {
        setDishesData(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
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
        <ScrollView contentContainerStyle={styles.scrollView}>
          {sortedDishes.map((dish, index) => (
            <React.Fragment key={dish.name+index}>
              {(index === 0 || sortedDishes[index - 1].category.menuGroup !== dish.category.menuGroup) && (
                <Text style={styles.groupTitle}>{dish.category.menuGroup}</Text>
              )}
              <View style={styles.card}>
                <Image
                  source={{ uri: pictures[dish.picturesId[0]]?.base64 || defaultDishImage }}
                  style={styles.cardImage} />
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