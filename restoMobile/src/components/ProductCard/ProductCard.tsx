import React, { useEffect, useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './ProductCard.styles';
import { IRestaurantFrontEnd } from '../../../../shared/models/restaurantInterfaces';
import { IProductFE } from '../../../../shared/models/productInterfaces';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { deleteProduct } from '../../services/productCalls';
import ModalConfirm from '../ModalConfirm/ModalConfirm';
import EditProductPage from '../../pages/EditProductPage/EditProductPage';
import { useNavigation } from '@react-navigation/native';
import { getAllResto } from '../../services/restoCalls';

interface ProductCardProps {
  product: IProductFE;
  onDelete: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [restaurants, setRestaurants] = useState<IRestaurantFrontEnd[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const allRestaurants = await getAllResto();
        setRestaurants(allRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(product);
      onDelete(product.name);
    } catch (error) {
      console.error(error);
    } finally {
      toggleModal();
    }
  };

  const handleEdit = () => {
    const names: string[] = product.restaurantId.map((id) => restaurants.find((restaurant) => restaurant.id === id)?.name).filter(Boolean);
    navigation.navigate('EditProductPage', {
      productID: product.id,
      productName: product.name,
      productIngredients: product.ingredients,
      productRestoNames: names,
    });
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.detailsText}>
          Ingredients: {product.ingredients.join(', ')}
        </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
            {<FontAwesomeIcon icon={ faTrash } size={15} color="gray" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
            {<FontAwesomeIcon icon={ faPen } size={15} color="gray" />}
          </TouchableOpacity>
          <ModalConfirm
            isVisible={isModalVisible}
            onConfirm={handleDeleteProduct}
            onCancel={toggleModal}
          />
        </View>
      </View>
      </View>
  );
};

export default ProductCard;
