import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface User {
    id: string;
    username?: string;
    email: string;
}

const ChatListScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const currentUserEmail = auth.currentUser?.email;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const fetchedUsers: User[] = [];

                querySnapshot.forEach(doc => {
                    const userData = doc.data();
                    if (userData.email && userData.email !== currentUserEmail) {
                        fetchedUsers.push({
                            id: doc.id,
                            username: userData.username || '',
                            email: userData.email,
                        });
                    }
                });

                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const handleUserPress = async (otherUser: User) => {

        // console.log("Selected user:", otherUser);
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const chatId = [currentUser.uid, otherUser.id].sort().join('_');
        const chatRef = doc(db, 'chats', chatId);

        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
            // Chat does not exist → create it
            await setDoc(chatRef, {
                participants: [currentUser.uid, otherUser.id],
                createdAt: new Date()
            });
        }

        navigation.navigate('ChatScreen', {
            recipientId: otherUser.id,
            recipientName: otherUser.username
        });
    };


    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-500 ">
            <View className="flex-1 py-2 mt-7">
                <View className=" bg-slate-400 mb-3">
                    <Text className='text-4xl font-bold text-gray-800 ml-3 p-4'>Available Users</Text>
                </View>

                {users.length === 0 ? (
                    <Text className="text-center text-black mt-10">No other users found</Text>
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleUserPress(item)}
                                className="bg-white p-3 pl-10 mb-3 border border-gray-400"
                            >
                                <Text className="text-lg font-medium text-gray-800">
                                    {item.username || item.email}
                                </Text>
                            </TouchableOpacity>

                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default ChatListScreen;
