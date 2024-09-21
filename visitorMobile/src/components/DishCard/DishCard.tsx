import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import styles from './DishCard.styles';
import { defaultDishImage } from "../../../assets/placeholderImagesBase64";
import { IimageInterface } from "../../models/imageInterface";
import {IDishFE} from '../../models/dishesInterfaces'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {addDishAsFavourite, deleteDishFromFavourites} from "../../services/favourites";
import {useTranslation} from "react-i18next";
import { getDishesByID } from '../../services/menuCalls';
import { getDishFavourites } from '../../services/favourites';
import { getImages } from '../../services/imageCalls';
import { faSlash } from '@fortawesome/free-solid-svg-icons';

interface DishCardProps {
  restoID: number;
  dish: IDishFE;
  isFavourite: boolean;
  pictures: IimageInterface[];
  dislikedIngredients?: string[];
  isSmallerCard?: boolean;
  isFirstLevel: boolean;
}

const DishCard: React.FC<DishCardProps> = ({ restoID, dish, isFavourite, pictures, dislikedIngredients, isSmallerCard, isFirstLevel }) => {
  const [isDishFavorite, setIsDishFavorite] = useState(isFavourite);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isAccordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [comboDishes, setComboDishes] = useState<IDishFE[]>([]);
  const [isFavouriteDishs, setIsFavouriteDishs] = React.useState<Array<{ restoID: number, dish: IDishFE }>>([]);
  const [comboPicture, setPictures] = useState<IimageInterface[]>([]);
  const [isComboPic, setCombPicBool] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();

  let picturesId = dish.picturesId;

  useEffect(() => {
    const fetchDishesByID = async () => {
      const dishes = await getDishesByID(dish.resto, { ids: dish.combo });
      setComboDishes(dishes);
    }

    async function fetchImages() {
      if (picturesId.length > 0) {
        const fetchedImages = await getImages(picturesId);
        setPictures(fetchedImages);
      } else {
        setPictures([{
          base64: defaultDishImage,
          contentType: "image/png",
          filename: "placeholderResto.png",
          size: 0,
          uploadDate: "0",
          id: 0,
        }]);
      }
    }

    setIsDishFavorite(isFavourite);
    fetchDarkMode();  
    if (dish.combo && dish.combo.length > 0 && isFirstLevel) {
      fetchDishesByID();
      fetchFavourites();
      setLoading(false);
    }
    if (dish.combo && dish.combo.length > 0 && !isFirstLevel) {
      fetchImages();
      setCombPicBool(true);
      setLoading(false);
    }
  }, [isFavourite, picturesId]);

  const fetchFavourites = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) { return; }

    try {
      const favouriteDishIds = await getDishFavourites(userToken);
      setIsFavouriteDishs(favouriteDishIds);
    } catch (error) {
      console.error("Error fetching user favourites:", error);
    }
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

  const handleFavoriteClick = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    setIsDishFavorite((prevIsFavorite) => !prevIsFavorite);

    if (!isDishFavorite) {
      await addDishAsFavourite(userToken, restoID, dish.uid);
    } else {
      await deleteDishFromFavourites(userToken, restoID, dish.uid);
    }
  };

  const handleAccordionToggle = () => {
    setAccordionOpen(!isAccordionOpen);
  };

  return (
    <React.Fragment>
      <View style={isSmallerCard ? (darkMode ? styles.cardSmallDarkTheme : styles.cardSmall) : (darkMode ? styles.cardDarkTheme : styles.card)}>
        {isComboPic ? (
          <Image
            source={{ uri: comboPicture[0]?.base64 || defaultDishImage }}
            style={isSmallerCard ? styles.cardImageSmall : styles.cardImage}
          />
        ) : (
          <Image
            source={{ uri: pictures[dish.picturesId[0]]?.base64 || defaultDishImage }}
            style={isSmallerCard ? styles.cardImageSmall : styles.cardImage}
          />
        )}
        <View style={styles.cardContent}>
          <View style={[styles.titleContainer, darkMode && styles.titleContainerDarkTheme]}>
            <Text style={[styles.cardTitle, darkMode && styles.cardTitleDarkTheme]}>{dish.name}</Text>
            <TouchableOpacity onPress={handleFavoriteClick}>
              <Icon
                name={isDishFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isDishFavorite ? '#FF0000' : '#000000'}
              />
            </TouchableOpacity>
          </View>
          <Text style= {[darkMode && styles.descriptionDarkTheme]} numberOfLines={2} ellipsizeMode="tail">{dish.description}</Text>
          {dislikedIngredients && dislikedIngredients.length !== 0 && (
            <View style={styles.row}>
              <Text style={[darkMode && styles.priceDarkTheme, styles.smallTitle]}>
                {t('components.DishCard.disliked-ingredients')}
                <Text style={[darkMode && styles.priceDarkTheme, styles.normalText]}>{dislikedIngredients.join(', ')}</Text>
              </Text>
            </View>
          )}
          <Text style={[darkMode && styles.priceDarkTheme]} > {t('components.DishCard.price', {price: dish.price})}</Text>
          {dish.discount !== undefined && dish.discount !== -1 ? (
            <View>
              <Text style={styles.discount}>{t('components.DishCard.price', {price: dish.price})}€</Text>
              <Text style={[darkMode && styles.priceDarkTheme]}>{t('components.DishCard.discount')}{dish.discount.toFixed(2)}€</Text>
              <Text style={[darkMode && styles.priceDarkTheme]}>{t('components.DishCard.valid')}{dish.validTill}</Text>
            </View>
          ) : (
            <Text style={[darkMode && styles.priceDarkTheme]} > {t('components.DishCard.price', {price: dish.price})}€</Text>
          )}
          <Text style={[darkMode && styles.priceDarkTheme]} > {t('components.DishCard.allergens', {allergens: dish.allergens.join(', ')})}</Text>
        </View>

        {dish.combo && dish.combo.length > 0 && isFirstLevel && !isLoading && (
          <View style={styles.accordionContainer}>
            <TouchableOpacity onPress={handleAccordionToggle} style={styles.accordionHeader}>
              <Text style={styles.accordionHeaderText}>
                {isAccordionOpen ? t('components.DishCard.hide') : t('components.DishCard.show')}
              </Text>
            </TouchableOpacity>
            {isAccordionOpen && (
              <View style={styles.comboContainer}>
                {comboDishes.map((comboDish, index) => {
                  const isFavourite = isFavouriteDishs.some(
                    fav => fav.restoID === restoID && fav.dish.uid === comboDish.uid
                  );

                  return (
                    <DishCard
                      key={comboDish.name + comboDish.uid + "-no-fit"}
                      restoID={restoID}
                      dish={comboDish}
                      isFavourite={isFavourite}
                      isSmallerCard={true}
                      pictures={[]}
                      isFirstLevel={false}
                    />
                  );
                })}
              </View>
            )}
          </View>
        )}
      </View>
    </React.Fragment>
  );
};

export default DishCard;
