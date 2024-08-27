// Componente Recipes
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { doc, updateDoc } from 'firebase/firestore';
import { dataBase } from '../Database/Firebase';
import { useDocs } from '../Hooks/useDocs';

import { Top } from './Top';
import { ShowRecipeDialog } from './DialogRecipe/ShowRecipeDialog';

export function Recipes() {
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);

    const {data} = useDocs(dataBase, 'Recipe', setLoading);

    const openDialog = (item) => {
        setSelectedItem(item);
    };

    return (
        <View style={styles.app}>
            {loading ? <Text style={{marginTop:50,textAlign: 'center', fontSize: 42, padding: 5}}>Cargando...</Text>:
            <>
            <Top page={'Recetas'} />
            <FlatList
                data={data}
                numColumns={2}
                renderItem={({ item }) => (
                    <Item data={item} onPress={() => openDialog(item)} />
                )}
                keyExtractor={(item) => item.id}
            />
            <ShowRecipeDialog
                data={selectedItem}
                visible={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />
            </>}
        </View>
    );
}

const Item = ({ data, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <Image src={data.imageUrl} style={styles.imageRecipe} />
        <Text style={styles.title}>{data.Title}</Text>
        <Text style={styles.calories}>Calorias: {data.Calories}</Text>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    app: {
        flex: 2,
        marginHorizontal: "auto",
        width: '100%',
      },
    item: {
        flex: 1,
        maxWidth: "50%",
        alignItems: "center",
        padding: 5,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#D3A357",
        borderRadius: 8,
        margin: 5
    },
    imageRecipe: {
        width: 75,
        height: 90,
        resizeMode: 'contain',
    },
    title:{
        fontSize: 18,
        textAlign: 'center'
    }
})