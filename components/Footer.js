import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from '../style';

export default class Footer extends Component {
    render() {
        return (
            <View style = {styles.footer}>
                <Text style = {styles.author}>
                    Author: Roope Puhakka
                </Text>
            </View>
        )
    }
}