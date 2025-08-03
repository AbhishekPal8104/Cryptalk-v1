// import './global.css'; // This file should have Tailwind directives
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Please fill all fields');
            return;
        }

        // Optional: Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid email format');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Logged in user:', user.email);
                Alert.alert('Login successful!', user.email || '');
                navigation.navigate('ChatList'); // Navigate to chat list screen
            })
            .catch(error => {
                // console.error('Login error:', error.message);
                Alert.alert('Login failed', error.message);
            });
    };


    return (
        <SafeAreaView className="flex-1 bg-slate-400">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center px-6 py-10">
                        <Text className="text-4xl font-extrabold text-center mb-8 text-gray-800">
                            Welcome to Cryptalk
                        </Text>

                        <TextInput
                            placeholder="Username or Email"
                            value={email}
                            onChangeText={setEmail}
                            className="border border-gray-300 rounded-xl px-4 py-4 mb-4 bg-white text-black focus:border-gray-800"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                        />

                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            className="border border-gray-300 rounded-xl px-4 py-4 mb-6 bg-gray-50 text-gray-800 focus:border-gray-800"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                        />

                        <TouchableOpacity
                            onPress={handleLogin}
                            className="bg-blue-500 py-4 rounded-xl mb-4 shadow-md"
                        >
                            <Text className="text-white text-center text-lg font-semibold">Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-blue-900 text-center text-base font-medium">
                                Don't have an account? Register
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
