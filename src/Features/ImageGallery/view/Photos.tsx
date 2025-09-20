import { View, Text, Image, TouchableOpacity, Dimensions, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { getImagesData } from '../../../api/getImages';
import { FlatList } from 'react-native';
import { getImagesResponse } from '../../../api/getImages';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { STRINGS } from '../../../constants/Strings';
import { SCREENNAMES } from '../../../navigation/constants';
import { StyleSheet } from 'react-native';

const Photos = () => {
    const [imagesData, setImagesData] = useState<getImagesResponse | null>(null);
    const [offset, setOffset] = useState(0); 
    const [type, setType] = useState('popular');
    const [showMore, setShowMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('108');
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Track if we're loading more vs initial load
    const screenWidth = useMemo(() => Dimensions.get('window').width, []);
    
    const flatListRef = useRef<FlatList>(null);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Photos'>>();

    const loadPage = async (isLoadMore = false) => {
        if (loading || !showMore) return;
        
        setLoading(true);
        if (isLoadMore) {
            setIsLoadingMore(true);
        }
        
        try {
            const response = await getImagesData(userId, type, offset);
            setImagesData(prev => {
                const prevImages = prev?.images ?? [];
                return {
                    ...response,
                    images: [...prevImages, ...(response.images ?? [])],
                };
            });
            if (!response.images || response.images.length < 10) {
                setShowMore(false);
            }
        } finally {
            setLoading(false);
            if (isLoadMore) {
                setIsLoadingMore(false);
            }
        }
    }

    const handleLoadMore = () => {
        if (!loading) {
            setOffset(prev => prev + 1);
        }
    };

    useEffect(() => {
        setImagesData(null);
        setOffset(0);
        setShowMore(true);
        setIsLoadingMore(false);
    }, [type, userId]);

    useEffect(() => {
        const isLoadMore = offset > 0;
        loadPage(isLoadMore);
    }, [offset, type, userId]);

    

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={imagesData?.images ?? []}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => (item.id ? `${item.id}-${item.xt_image}-${index}` : `${item.xt_image}-${index}`)}
                renderItem={({ item }) => (
                    <Pressable onPress={() => navigation.navigate(SCREENNAMES.PHOTO_DETAIL, { imageUrl: item.xt_image })} style={styles.imageContainer}>
                        <Image source={{ uri: item.xt_image }} style={{ width: 300,height: 300, aspectRatio: 1, resizeMode: 'contain', marginBottom: 16 }} />
                    </Pressable>
                )}
                ListFooterComponent={
                    showMore ? (
                        <TouchableOpacity
                            onPress={handleLoadMore}
                            disabled={loading}
                            style={{ padding: 12, alignItems: 'center', opacity: loading ? 0.6 : 1 }}
                            accessibilityRole="button"
                            accessibilityLabel={STRINGS.ClickHereToLoadMore}
                        >
                            {loading ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <ActivityIndicator size="small" color="blue" />
                                    <Text style={{ color: 'blue', fontWeight: '600' }}>{STRINGS.Loading}</Text>
                                </View>
                            ) : (
                                <Text style={{ color: 'blue', fontWeight: '600' }}>{STRINGS.ClickHereToLoadMore}</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <View style={{ padding: 12, alignItems: 'center' }}>
                            <Text>{STRINGS.NoMoreImagesToLoad}</Text>
                        </View>
                    )
                }
                // Key prop to maintain scroll position when loading more
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                }}
                removeClippedSubviews={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        marginVertical: 10,
        overflow: 'hidden',
        width: '100%',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: 'white'
    }
})

export default Photos