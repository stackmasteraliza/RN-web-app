import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import colors from './constants/colors';
import SecureStorage from './services/store';

const SplashScreen = () => {
    const router = useRouter();
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();

        const redirect = async () => {
            const user = await SecureStorage.getData('user');
            if(user){
                setTimeout(() => {
                    router.replace('/screens/home/users');
                }, 3000);
            } else {
                setTimeout(() => {
                    router.replace('/screens/auth/login');
                }, 3000);
            }
        }

        redirect();
    }, [rotation, router]);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('./assets/images/logo.png')}
                style={[styles.logo, { transform: [{ rotate: rotateInterpolate }] }]}
            />
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primaryText,
    },
    logo: {
        width: 100,
        height: 100,
    },
    loadingText: {
        fontSize: 18,
        color: colors.darkgrey,
    },
});

export default SplashScreen;
