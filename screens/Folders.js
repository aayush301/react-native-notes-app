import { View, Text, TextInput, Pressable, Alert, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import ActionButton from '../components/ActionButton';
import Modal from '../components/Modal';
import { getData, storeData } from '../utils/storage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import theme from '../style/theme';
import FolderCard from '../components/FolderCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Folders = () => {
  const [folders, setFolders] = useState([]);
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [FolderNameInput, setFolderNameInput] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    const fetchFolders = async () => {
      try {
        const folders = (await getData("folders")) || [];
        setFolders(folders);
        setLoading(false);
      }
      catch (err) {
        console.log(err);
        Alert.alert("Error", "Folders couldn't be fetched");
      }
    }
    fetchFolders();
  }, []));

  const closeModal = () => {
    setCreateFolderModal(false);
    setFolderNameInput("");
  }

  const createFolder = async () => {
    try {
      if (FolderNameInput === "") return;
      const newFolder = {
        id: Math.floor(Math.random() * 10000),
        name: FolderNameInput,
        notes: [],
        createdAt: new Date(),
      };

      const newFoldersArr = [newFolder, ...folders];
      await storeData("folders", newFoldersArr);
      setFolders(newFoldersArr);
      ToastAndroid.show("Folder created", ToastAndroid.SHORT);
      closeModal();
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const changeOrderOfFolders = async ({ data }) => {
    try {
      const newFoldersArr = data;
      if (newFoldersArr.length === folders.length && JSON.stringify(newFoldersArr.map(folder => folder.id)) === JSON.stringify(folders.map(folder => folder.id))) return;
      setFolders(newFoldersArr);
      await storeData("folders", newFoldersArr);
    }
    catch (err) {
      console.log(err);
      Alert.alert("Error", "Some error is there!!");
    }
  }

  const handlePress = folderId => {
    navigation.navigate("FolderNotes", { folderId });
  }

  const getDraggableFlatList = folders => {
    return <DraggableFlatList
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingTop: 5, paddingBottom: 60 }}
      containerStyle={{ flex: 1 }}
      data={folders}
      keyExtractor={folder => folder.id}
      renderItem={({ item: folder, drag, isActive }) => <FolderCard {...{ folder, drag, isActive, handlePress, }} />}
      onDragEnd={changeOrderOfFolders}
      autoscrollThreshold={100}
    />
  }



  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>

      {folders.length === 0 && (
        <View style={{ marginTop: 200, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 16, textAlign: "center", lineHeight: 30 }}>
            No folders present.. Tap + icon to create new folder
          </Text>
        </View>
      )}

      {folders.length > 0 && (
        <>
          <Text style={{ color: theme.PRIMARY_COLOR, fontWeight: "600", fontSize: 15, paddingHorizontal: 10, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: "#efefef" }}>{folders.length} folder{folders.length > 1 && 's'}</Text>
          {getDraggableFlatList(folders)}
        </>
      )}



      <ActionButton onPress={() => setCreateFolderModal(true)} />
      <Modal visible={createFolderModal} onRequestClose={closeModal}>
        <View>
          <Text style={{ marginVertical: 10, fontWeight: '500', fontSize: 18, textAlign: 'center' }}>New folder</Text>
          <TextInput
            value={FolderNameInput}
            onChangeText={text => setFolderNameInput(text)}
            placeholder='Folder name'
            style={{ backgroundColor: "#eee", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 2 }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 25, marginBottom: 10, paddingHorizontal: 8 }}>
            <Pressable
              onPress={createFolder}
              disabled={!FolderNameInput}
              style={{ backgroundColor: "#ddd", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 3 }}
              android_ripple={{ color: "#bbb", radius: 200 }}
            >
              <Text style={{ fontWeight: "500", color: "#444" }}>Create</Text>
            </Pressable>

            <Pressable
              onPress={closeModal}
              style={{ backgroundColor: "#d46262", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 3 }}
              android_ripple={{ color: "#bbb", radius: 200 }}
            >
              <Text style={{ fontWeight: "500", color: "#fff" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Folders