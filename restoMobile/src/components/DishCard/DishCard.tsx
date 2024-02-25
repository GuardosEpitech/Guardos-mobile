import React, { useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import ModalConfirm from '../ModalConfirm/ModalConfirm';
import { useNavigation } from '@react-navigation/native';
import {IDishFE} from "../../../../shared/models/dishInterfaces";
import styles from "./DishCard.style";
import { getImages } from "../../services/imagesCalls";
import { defaultDishImage, defaultRestoImage } from "../../assets/placeholderImagesBase64";
import { IimageInterface } from "../../models/imageInterface";

interface DishCardProps {
  dish: IDishFE;
  onDelete: any;
}

const whatToDelete = "dish";

const DishCard: React.FC<DishCardProps> = ({ dish, onDelete }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [pictures, setPictures] = useState<IimageInterface[]>([]);


  if (!dish) {
    return null;
  }

  if (dish.name.length === 0) {
    dish.name = "No name";
  }
  if (dish.description.length === 0) {
    dish.description = "No description";
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDeleteDish = async () => {
    try {
      onDelete(dish.name, dish.resto);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      toggleModal();
    }
  };

  let picturesId = dish.picturesId;
  useEffect(() => {
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

    fetchImages();
  }, [picturesId]);

//  const handleEdit = () => {
//    const names: string[] = product.restaurantId.map((id) => restaurants.find((restaurant) => restaurant.id === id)?.name).filter(Boolean);
//    navigation.navigate('EditProductPage', {
//      productID: product.id,
//      productName: product.name,
//      productIngredients: product.ingredients,
//      productRestoNames: names,
//    });
//  };
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Image
          style={styles.imageStyle}
          resizeMode="contain"
          source={
            pictures.length > 0 && pictures[0].base64
              ? { uri: pictures[0].base64 }
              : { uri: defaultRestoImage }
          }
        />
        <View style={styles.infoStyle}>
          <Text style={styles.titleStyle} numberOfLines={1} ellipsizeMode="tail">
            {dish.name}
          </Text>
          <Text style={styles.categoryStyle} numberOfLines={2} ellipsizeMode="tail">
            {dish.description} // Add a description field or similar
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
            <FontAwesomeIcon icon={faTrash} size={15} color="gray" />
          </TouchableOpacity>
          <ModalConfirm
            whatToDelete={whatToDelete}
            isVisible={isModalVisible}
            onConfirm={handleDeleteDish}
            onCancel={toggleModal}
          />
        </View>
      </View>
    </View>
  );
};
export default DishCard;
