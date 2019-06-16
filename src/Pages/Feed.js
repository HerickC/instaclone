/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, FlatList,
} from 'react-native';
import io from 'socket.io-client';
import api from '../Services/api';

import CameraIcon from '../assets/camera.png';
import MoreIcon from '../assets/more.png';
import LikeIcon from '../assets/like.png';
import CommentIcon from '../assets/comment.png';
import SendIcon from '../assets/send.png';

require('dotenv/config');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feedItem: {
    marginTop: 20,
  },
  feedItemHeader: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    color: '#000',
  },
  place: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 15,
  },
  feedItemFooter: {
    paddingHorizontal: 15,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    marginRight: 8,
  },
  likes: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    lineHeight: 18,
    color: '#000',
  },
});

export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('New')}>
        <Image source={CameraIcon} />
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    this.state = { feed: [] };
  }

  async componentDidMount() {
    this.registerToSocket();
    const response = await api.get('posts');
    this.setState({ feed: response.data });
  }

  registerToSocket = () => {
    const socket = io(process.env.API_URL);

    socket.on('post', (newPost) => {
      this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on('like', (likedPost) => {
      this.setState({
        feed: this.state.feed.map(post => (post._id === likedPost._id ? likedPost : post)),
      });
    });
  };

  handleLike = (id) => {
    api.post(`/posts/${id}/like`);
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View style={styles.feedItemHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{item.author}</Text>
                  <Text style={styles.place}>{item.place}</Text>
                </View>
                <TouchableOpacity onPress={() => {}}>
                  <Image source={MoreIcon} />
                </TouchableOpacity>
              </View>
              <Image
                style={styles.feedImage}
                source={{ uri: `${process.env.API_URL}/files/${item.image}` }}
              />
              <View style={styles.feedItemFooter}>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)}>
                    <Image source={LikeIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => {}}>
                    <Image source={CommentIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => {}}>
                    <Image source={SendIcon} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.likes}>{`${item.likes} Curtidas`}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.hashtags}>{item.hashtags}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}
