import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import firebase from '@/app/firebase/firebaseConfig';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import styles from './styles';
import colors from '@/app/constants/colors';
import { deleteUser } from 'firebase/auth';
import SecureStorage from '@/app/services/store';

const UsersScreen = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const message = useLocalSearchParams();
    const [success, setSuccess] = useState(message.message || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const { auth, db } = firebase;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersList: any[] = [];
                querySnapshot.forEach((doc) => {
                    usersList.push({ id: doc.id, ...doc.data() });
                });
                setUsers(usersList);
            } catch (error) {
                console.log('Error fetching users: ', error);
                setError("Unexpected Error Occured, Try relaoding the screen again.");
            } finally {
                setLoading(false);
            }
            setTimeout(() => {
                setSuccess('');
            }, 3000)
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            `${user.name}`.toLowerCase().includes(search.toLowerCase())
    );

    const renderUser = ({ item }: any) => (
        <TouchableOpacity style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteUsers(item.id)}>
                {deletingUserId === item.id ? (
                    <ActivityIndicator size="large" color={colors.danger} />
                ) : (
                    <Image source={require('../../assets/icons/bin.png')} />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const deleteUsers = async (userId: string) => {
        setDeletingUserId(userId);

        try {
            const userDocRef = doc(db, 'users', userId);
            await deleteDoc(userDocRef);
            const user = auth.currentUser;
            if (user && user.uid) {
                await deleteUser(user);
            }

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

            setSuccess('User deleted successfully!');
        } catch (error) {
            console.log('Error deleting user: ', error);
            setError('There was an issue deleting the user.');
        } finally {
            setDeletingUserId(null);
        }
    };
    const { width, height } = useWindowDimensions();

    const renderRow = ({ item, index }: any) => {
        if (index % 3 === 0) {
            return (
                <View style={styles.row}>
                    {filteredUsers.slice(index, index + 3).map((user) => (
                        <View key={user.id} style={[styles.cardContainer, { width: width > 400 ? "30%" : "100%", }]}>
                            {renderUser({ item: user })}
                        </View>
                    ))}
                </View>
            );
        }
        return null;
    };



    return (
        <View style={{
            height: "100%",
        }}>
            <View style={{ paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.primary, paddingHorizontal: 15 }}>
                <Text style={styles.header}>Users</Text>
                <TextInput
                    style={[styles.searchBar, { outlineColor: colors.primary, width: 240 }]}
                    placeholder="Search Users"
                    placeholderTextColor={colors.lightgrey}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            <View style={styles.container}>
                {error && <Text style={[styles.errorText, { textAlign: 'center' }]}>{error}</Text>}
                {success && <Text style={[styles.errorText, { textAlign: 'center', color: colors.primary }]}>{success}</Text>}
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                ) : (
                    <FlatList
                        data={filteredUsers}
                        renderItem={renderRow}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                    />
                )}
            </View>
            <TouchableOpacity style={styles.fab} onPress={async () => {
                await SecureStorage.removeData('user');
                router.navigate('/')
            }}>
                <Text style={styles.fabText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UsersScreen;
