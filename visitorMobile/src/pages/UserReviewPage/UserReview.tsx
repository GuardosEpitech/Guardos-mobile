import React, { useState, useEffect } from 'react';
import {View, TextInput, Text, TouchableOpacity, ScrollView} from 'react-native';
import styles from './UserReview.styles'
import {IRequestUser} from '../../models/emailInterfaces'
import {useTranslation} from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVisitorUserPermission } from '../../services/permissionsCalls';
import {getVisitorProfileDetails} from "../../services/profileCalls";
import {deleteRatingDataUser, getRatingDataUser} from "../../services/ratingCalls";
import Icon from "react-native-vector-icons/MaterialIcons";

type ReviewPageProps = {
    route: any;
};

const initialRequestState = {
    name: '',
    subject: '',
    request: '',
    isPremium: 'false',
}

const RatingPage: React.FC<ReviewPageProps> = ({route}) => {
    const [request, setRequest] = useState<IRequestUser>(initialRequestState);
    const {t} = useTranslation();
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [userReview, setUserReview] = useState([])

    useEffect(() => {
        const fetchUserData = async () => {
                const userToken = await AsyncStorage.getItem('userToken');
                if (userToken === null) {
                    return;
                }
                getVisitorProfileDetails(userToken)
                    .then((res) => {
                        setName(res.username);
                    });
        }
        fetchUserData()
    })
    const deleteReview = async (reviewId, restoName) => {
        try {
            await deleteRatingDataUser(reviewId, restoName)
        } catch (err) {
            console.error(err);
        }
    };
    const handleInputChange = (field: keyof IRequestUser, text: string) => {
        setRequest(prevState => ({
            ...prevState,
            [field]: text,
        }));
    };

    const getPremium = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken === null) {
                return;
            }
            const permissions = await getVisitorUserPermission(userToken);
            const isPremiumUser = permissions.includes('premiumUser');
            if (isPremiumUser) {
                handleInputChange('isPremium', 'true');
            } else {
                handleInputChange('isPremium', 'false');
            }
        } catch (error) {
            console.error("Error getting permissions: ", error);
        }
    }

    const fetchReview = async () => {
        const review = await getRatingDataUser(name);
        setUserReview(review);
    }

    useEffect(() => {
        try {
            getPremium();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, []);

    useEffect(() => {
        fetchReview();
        fetchDarkMode();
    })

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

    return (
        <View style={[styles.container]}>
            <ScrollView>

            <Text style={styles.mainTitle}>{t('pages.Review.your-review')}</Text>
            {!userReview?.length ?
                <Text>{t('pages.Review.no-review')}</Text>
                :
            userReview.map((index, key) => (
                <View style={styles.card} key={key}>
                    <View style={styles.containerStar}>
                        <Icon
                            name={'star'}
                            size={17}
                            color={'grey'}
                        />
                        <Text style={styles.note}>{index.note}</Text>
                    </View>
                    <Text style={styles.comment}>{t('pages.Review.comment-review')} {index.comment}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => deleteReview(index._id, index.restoName)}><Text style={{color: "white"}}>{t('pages.Review.delete-review')}</Text></TouchableOpacity>
                </View>
            ))
            }

                </ScrollView>
        </View>
    );
};
export default RatingPage;
