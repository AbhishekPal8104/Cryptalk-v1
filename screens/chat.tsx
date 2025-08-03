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
import { useRoute, useNavigation } from '@react-navigation/native';
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
import { encryptMessage, decryptMessage } from '../utils/encrytion';

interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
    // receivedAt?: any; // Optional for received messages
}

const ChatScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
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

        try {
            const encryptedText = await encryptMessage(text.trim());

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

        const createdTime = item.createdAt?.toDate?.().toLocaleTimeString?.([], {
            hour: '2-digit',
            minute: '2-digit',
        }) || '';

        // const receivedTime = item.receivedAt?.toDate?.().toLocaleTimeString?.([], {
        //     hour: '2-digit',
        //     minute: '2-digit',
        // }) || '';

        return (
            <View className={`my-1 px-3 py-2 max-w-[80%] rounded-xl ${isSender ? 'bg-blue-500 self-end' : 'bg-zinc-400 self-start'}`}>
                <Text className={`text-base ${isSender ? 'text-white' : 'text-black'}`}>
                    {decryptedText}
                </Text>
                <View>
                    <Text className={`text-[10px] ${isSender ? 'text-white/70' : 'text-black/60'}`}>
                        {createdTime}
                    </Text>
                    {/* {!isSender && item.receivedAt && (
                        <Text className="text-[10px] text-black/60">
                            Received: {receivedTime}
                        </Text>
                    )} */}
                </View>
            </View>
        );
    };


    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header with recipient name */}
            <View className="flex-row items-center px-4 py-3 border pt-4 mt-2 border-gray-900 bg-slate-400">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-3xl font-semibold ml-4 text-gray-800">
                    {recipientName}
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 bg-slate-300">
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

                        {/* Input area */}
                        <View
                            className="flex-row items-center px-3 pt-2 border-t border-gray-900 bg-slate-700"
                            style={{
                                paddingBottom: Platform.OS === 'ios' ? insets.bottom : 3,
                            }}
                        >
                            <TextInput
                                value={text}
                                onChangeText={setText}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 bg-slate-300 rounded-full text-base max-h-32 min-h-[50px]"
                                multiline
                                blurOnSubmit={false}
                                onSubmitEditing={sendMessage}
                            />
                            <TouchableOpacity onPress={sendMessage} className="ml-3">
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
