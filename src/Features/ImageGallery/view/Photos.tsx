import { View, Text, Image, TouchableOpacity, Dimensions, Pressable } from 'react-native'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { getImagesData } from '../../../api/getImages';
import { FlatList } from 'react-native';
import { getImagesResponse } from '../../../api/getImages';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';


const Photos = () => {
    const [imagesData, setImagesData] = useState<getImagesResponse | null>(null);
    const [offset, setOffset] = useState(0); // page-based: 0,1,2,...
    const [type, setType] = useState('popular');
    const [showMore, setShowMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const screenWidth = useMemo(() => Dimensions.get('window').width, []);

    const onEndReachedCalledDuringMomentum = useRef(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Photos'>>();

    const loadPage = async () => {
        if (loading || !showMore) return;
        setLoading(true);
        try {
            const response = await getImagesData('108', type, offset);
            setImagesData(prev => {
                if (!prev) return response;
                const existingIds = new Set(prev.images.map(i => i.id));
                const newUnique = response.images.filter(i => !existingIds.has(i.id));
                return {
                    ...response,
                    images: [...prev.images, ...newUnique],
                };
            });
            if (!response.images || response.images.length < 10) {
                setShowMore(false);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // when type changes, reset list and start from page 0
        setImagesData(null);
        setOffset(0);
        setShowMore(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    useEffect(() => {
        // fetch whenever offset or type changes
        loadPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset, type]);

    const AutoHeightImage = ({ uri, width }: { uri: string; width: number }) => {
        const [height, setHeight] = useState<number | undefined>(undefined);
        useEffect(() => {
            let mounted = true;
            Image.getSize(
                uri,
                (w, h) => {
                    if (mounted) setHeight(width * (h / w));
                },
                () => {
                    if (mounted) setHeight(width * 0.75); // fallback ratio
                }
            );
            return () => { mounted = false; };
        }, [uri, width]);
        return (
            <Image source={{ uri }} style={{ width, height, resizeMode: 'cover' }} />
        );
    };
  return (
    <View>
      <FlatList
        data={imagesData?.images ?? []}
        keyExtractor={(item, index) => (item.id ? `${item.id}-${item.xt_image}-${index}` : `${item.xt_image}-${index}`)}
        renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('PhotoDetail', { imageUrl: item.xt_image })}>
              <AutoHeightImage uri={item.xt_image} width={screenWidth} />
            </Pressable>
        )}
        onEndReachedThreshold={0.7} 
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false; }}
        onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current && showMore && !loading) {
                onEndReachedCalledDuringMomentum.current = true;
                setOffset(prev => prev + 1);
            }
        }}
        ListFooterComponent={
            showMore ? (
                <TouchableOpacity
                    onPress={() => { if (!loading) setOffset(prev => prev + 1); }}
                    style={{ padding: 12, alignItems: 'center' }}
                    accessibilityRole="button"
                    accessibilityLabel="Click here to load more"
                >
                    <Text style={{ color: 'blue', fontWeight: '600' }}>
                        {loading ? 'Loading…' : 'Click here to load more'}
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={{ padding: 12, alignItems: 'center' }}>
                    <Text>No more images to load</Text>
                </View>
            )
        }
      />
    </View>
  )
}

export default Photos