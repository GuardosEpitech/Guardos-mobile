import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, Button, TouchableOpacity, Dimensions} from 'react-native';
import styles from './MenuPage.styles';
import { getDishesByResto } from '../../services/dishCalls';
import {Dish} from '../../models/dishesInterfaces'
import { defaultDishImage } from "../../../assets/placeholderImagesBase64";
import { IimageInterface } from "../../models/imageInterface";
import { getImages } from "../../services/imageCalls";

export  interface DishData {
  _id: number;
  dishes: Dish[];
}

const DishCard = ({ dish, pictures, defaultDishImage, styles }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity onPress={toggleDescription}>
      <View style={styles.card}>
        <Image
          source={{ uri: pictures[dish.picturesId[0]]?.base64 || defaultDishImage }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{dish.name}</Text>
          <Text numberOfLines={isExpanded ? undefined : 1} ellipsizeMode='tail'>
            {isExpanded ? dish.description : (dish.description.length > 30 ? dish.description.substring(0, 30) + '...' : dish.description)}
          </Text>
          <Text>Price: ${dish.price}</Text>
          <View style={styles.TxtAllergens}>
            <Text style={styles.AllergensLabel}>Allergens:</Text>
            <View>
              <Text style={styles.AllergensText}>{dish.allergens.join(', ')}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MenuPage: React.FC = ({ route, navigation }) => {
  const [dishesData, setDishesData] = useState<DishData[]>([]);
  const [loading, setLoading] = useState(true);
  const {restaurantId, restaurantName } = route.params;
  const scrollViewRef = useRef(null);
  const AppetizerRef = useRef(null);
  const MaindishRef = useRef(null);
  const DessertRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  
  const scrollToText = (btnref) => {
    // Replace 'textRef' with the reference to your text component
    if (scrollViewRef.current && btnref.current) {
      btnref.current.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current.scrollTo({ y, animated: true });
        }
      );
    }
  };

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

  // Ref for the text component you want to scroll to

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
        <ScrollView contentContainerStyle={styles.scrollView} ref={scrollViewRef}>
          <View style={styles.BtnTypeContainer}>
            <TouchableOpacity style={styles.BtnType} onPress={() => scrollToText(AppetizerRef)} ><Text style={styles.BtnTypeText}>Appetizer</Text></TouchableOpacity> 
            <TouchableOpacity style={styles.BtnType} onPress={() => scrollToText(MaindishRef)} ><Text style={styles.BtnTypeText}>Maindish</Text></TouchableOpacity> 
            <TouchableOpacity style={styles.BtnType} onPress={() => scrollToText(DessertRef)} ><Text style={styles.BtnTypeText}>Dessert</Text></TouchableOpacity> 
          </View>
          {sortedDishes.map((dish, index) => (
            <React.Fragment key={dish.name+index}>
              {(index === 0 || sortedDishes[index - 1].category.menuGroup !== dish.category.menuGroup) && (
                  <Text style={styles.groupTitle} ref={ref => {
                    switch (dish.category.menuGroup) {
                      case 'Appetizer':
                        AppetizerRef.current = ref;
                        break;
                        case 'Maindish':
                          MaindishRef.current = ref;
                          break;
                          case 'Dessert':
                            DessertRef.current = ref;
                            break;
                            default:
                              break;
                            }
                          }}>
                    {dish.category.menuGroup}
                  </Text>
              )}
              <DishCard
                key={index}
                dish={dish}
                pictures={pictures}
                defaultDishImage={defaultDishImage}
                styles={styles}
                />
            </React.Fragment>
          ))}
        </ScrollView>
      )}
    </View>
  );
  
};

export default MenuPage;