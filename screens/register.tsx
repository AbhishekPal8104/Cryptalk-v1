import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as native from '@react-navigation/native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../firebase'; // adjust the path if needed
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = native.useNavigation();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optional: update user's display name
      await updateProfile(user, { displayName: username });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        createdAt: new Date().toISOString()
      });

      Alert.alert('Account created for', username);
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Registration error:', error.message);
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-slate-400">
      <Text className="text-3xl font-bold mb-8 text-center text-gray-800">Create Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        className="border border-gray-500 rounded-lg px-4 py-4 mb-4 bg-white text-black focus:border-gray-900"
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-500 rounded-lg px-4 py-4 mb-4 bg-white text-black focus:border-gray-900"
        placeholderTextColor="#999"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-500 rounded-lg px-4 py-4 mb-4 bg-white text-black focus:border-gray-900"
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={handleRegister} className="bg-green-700 py-3 rounded-md mb-4">
        <Text className="text-white text-center font-semibold">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text className="text-blue-900 text-center">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
