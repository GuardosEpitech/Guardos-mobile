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
    const [newComment, setNewComment] = useState<string>();
    const note = [
        {
            label: 0
        },
        {
            label: 1
        },
        {
            label: 2
        },
        {
            label: 3
        },
        {
            label: 4
        },
        {
            label: 5
        }
    ];
     const addReview = async () => {
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
                const userToken = await AsyncStorage.getItem('user');
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
            const userToken = await AsyncStorage.getItem('user');
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
        <View style={[styles.container]}>
            <Text style={styles.mainTitle}>{t('pages.Review.add-review')}</Text>
            <Text>{t('pages.Review.your-review')}</Text>
            <Dropdown
                style={styles.dropdown}
                data={note}
                maxHeight={300}
                labelField="label"
                valueField="label"
                placeholder={'Note'}
                searchPlaceholder={'Note'}
                value={value}
                onChange={(note) => {
                    setValue(note.label);
                }}
            />
            <TextInput
                style={styles.input}
                onChangeText={handleCommentChange}
                value={newComment}
                placeholder={"Your comment"}
                placeholderTextColor={darkMode ? 'white' : 'black'}
            />
            <TouchableOpacity onPress={addReview} style={styles.button}>
                <Text style={{color: "white"}}>{t('pages.Review.add-review')}</Text>
            </TouchableOpacity>
            <Text style={styles.allReview}>{t('pages.Review.all-review')}</Text>
                <ScrollView>
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
                </ScrollView>
        </View>
    );
};
export default RatingPage;
