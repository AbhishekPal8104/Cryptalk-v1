import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { encryptMessage, decryptMessage } from '../utils/encrytion'; // Adjust the import path as necessary

interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
}

const ChatScreen = () => {
    const route = useRoute<any>();
    const { recipientId, recipientName } = route.params;
    const currentUser = auth.currentUser;
    const insets = useSafeAreaInsets();

    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const chatId = [currentUser?.uid, recipientId].sort().join('_');

    useEffect(() => {
        const q = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    senderId: typeof data.senderId === 'string' ? data.senderId : '',
                    text: typeof data.text === 'string' ? data.text : '',
                    createdAt: data.createdAt || null,
                };
            }) as Message[];

            setMessages(fetchedMessages);

            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = async () => {
        if (!text.trim()) return;

        console.log('Sending message:', text);

        try {
            const encryptedText = await encryptMessage(text.trim());

            console.log('Encrypted:', encryptedText);
            console.log('Decrypted:', decryptMessage(encryptedText));

            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                text: encryptedText,
                senderId: currentUser?.uid,
                createdAt: serverTimestamp()
            });

            setText('');
        } catch (e) {
            console.error('Encryption error:', e);
        }
    };


    const renderItem = ({ item }: { item: Message }) => {
        const isSender = item.senderId === currentUser?.uid;
        const decryptedText = decryptMessage(item.text);

        return (
            <View
                className={`my-1 px-3 py-2 max-w-[80%] rounded-xl ${isSender ? 'bg-blue-500 self-end' : 'bg-gray-300 self-start'
                    }`}
            >
                <Text className={`text-sm ${isSender ? 'text-white' : 'text-black'}`}>
                    {decryptedText}
                </Text>
            </View>
        );
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Added a View inside KeyboardAvoidingView to ensure flex: 1 applies correctly */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}> {/* This View ensures content expands */}
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{ padding: 12, flexGrow: 1, justifyContent: 'flex-end' }}
                            showsVerticalScrollIndicator={false}
                            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        />

                        {/* Input Box and Send Button */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 12,
                                paddingTop: 10,
                                paddingBottom: Platform.OS === 'ios' ? insets.bottom : 3,
                                borderTopWidth: 1,
                                borderColor: '#ccc',
                                backgroundColor: 'white',
                            }}
                        >
                            <TextInput
                                value={text}
                                onChangeText={setText}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 25,
                                    fontSize: 16,
                                    minHeight: 50,
                                    maxHeight: 120,
                                }}
                                multiline
                                blurOnSubmit={false}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
                                <Ionicons name="send" size={26} color="#1E90FF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;
