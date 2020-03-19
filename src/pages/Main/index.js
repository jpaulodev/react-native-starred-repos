import React, { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Storage from '../../services/storage';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';
import api from '../../services/api';

function Main({ navigation }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Storage.set('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    async function getUsersFromStorage() {
      const storedUsers = await Storage.get('users');

      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    }

    getUsersFromStorage();
  }, []);

  const handleAddUser = async () => {
    setLoading(true);

    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    setUsers([...users, data]);
    setNewUser(null);
    setLoading(false);

    Keyboard.dismiss();
  };

  const handleNavigate = user => {
    navigation.navigate('User', { user });
  };

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          value={newUser}
          onChangeText={setNewUser}
          placeholder="Adicionar usuário"
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />
        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Icon name="add" size={20} color="#FFF" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({ item }) => (
          <User>
            <Avatar source={{ uri: item.avatar }} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Main;
