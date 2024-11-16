import React, { useState, useEffect } from 'react';
import {View, TextInput, Text, TouchableOpacity, ScrollView} from 'react-native';
import styles from './Rating.styles'
import {IRequestUser} from '../../models/emailInterfaces'
import {useTranslation} from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVisitorUserPermission } from '../../services/permissionsCalls';
import {getVisitorProfileDetails} from "../../services/profileCalls";
import {getRatingData, postRatingData} from "../../services/ratingCalls";
import { Dropdown } from 'react-native-element-dropdown';

import Icon from "react-native-vector-icons/MaterialIcons";
import styleToBarStyle from "expo-status-bar/build/styleToBarStyle";

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
    const [review, setReview]= useState(route.params.ratingData)
    const restoName = route.params.restoName
    const [request, setRequest] = useState<IRequestUser>(initialRequestState);
    const {t} = useTranslation();
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [value, setValue] = useState(null);
    const [ invalidInput, setInvalidInput] = useState<boolean>();
    const [newComment, setNewComment] = useState<string>();

    const note = [
        { label: '0', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
    ];

    const addReview = async () => {
         if (newComment === undefined || value === null) {
             setInvalidInput(true)
             return
         }
         try {
             await postRatingData(restoName, newComment, value, name);
             setValue(2);
             setNewComment('');
         } catch (err) {
             console.error(err);
         }
         getRatingData(restoName)
             .then(res => setReview(res));
    };
    const handleCommentChange = (text) => {
        setNewComment(text);
    };

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

    useEffect(() => {
        try {
            getPremium();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, []);

    useEffect(() => {
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
            <ScrollView>
        <View style={(darkMode ? styles.containerDarkTheme : styles.container)}>

            <Text style={(darkMode ? styles.mainTitleDark : styles.mainTitle)}>{t('pages.Review.add-review')}</Text>
            <Text style={darkMode? {color: "white"} : {color: "black" }}>{t('pages.Review.your-review')}</Text>
            <Dropdown
                style={styles.dropdown}
                data={note}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={t('pages.Review.note')}
                value={value}
                onChange={(item) => {
                    setValue(item.value);
                }}
            />
            <TextInput
                style={styles.input}
                onChangeText={handleCommentChange}
                value={newComment}
                placeholder={t('pages.Review.your-comment')}
                placeholderTextColor={darkMode ? 'white' : 'black'}
            />
            {invalidInput && <Text style={{color: "red"}}>{t('pages.Review.invalid')}</Text>}
            <TouchableOpacity onPress={addReview} style={styles.button}>
                <Text style={{color: "white"}}>{t('pages.Review.add-review')}</Text>
            </TouchableOpacity>
            <Text style={darkMode ? styles.allReviewDark : styles.allReview}>{t('pages.Review.all-review')}</Text>
            {review.map((index, key) => (

                <View style={styles.card} key={key}>
                    <View style={styles.containerStar}>
                    <Icon
                        name={'star'}
                        size={24}
                        color={'grey'}
                    />
                        <Text style={styles.note}>{index.note}</Text>
                    </View>
                    <Text style={styles.comment}>{index.comment}</Text>
                </View>
            ))}
        </View>
                </ScrollView>
    );
};
export default RatingPage;
