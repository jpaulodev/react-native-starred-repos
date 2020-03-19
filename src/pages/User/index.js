import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

function User({ route }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    async function getStarredRepos() {
      const { user } = route.params;
      const response = await api.get(`/users/${user.login}/starred`);

      setStars(response.data);
    }

    getStarredRepos();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: route.params.user.avatar }} />
        <Name>{route.params.user.name}</Name>
        <Bio>{route.params.user.bio}</Bio>
      </Header>

      <Stars
        data={stars}
        keyExtractor={star => String(star.id)}
        renderItem={({ item }) => (
          <Starred>
            <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
            <Info>
              <Title>{item.name}</Title>
              <Author>{item.owner.login}</Author>
            </Info>
          </Starred>
        )}
      />
    </Container>
  );
}

User.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};

export default User;
