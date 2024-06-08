import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface FileData {
  name: string;
  uri: string;
  type: string;
  base64?: string;
}

const FileSharingScreen: React.FC = () => {
  const [file, setFile] = useState<FileData | null>(null);
  const [receivedFile, setReceivedFile] = useState<FileData | null>(null);
  const [receiverId, setReceiverId] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isReceivedFileModalVisible, setIsReceivedFileModalVisible] =
    useState<boolean>(false);
  const [clientId, setClientId] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.18.43:8080"); // Use your IP address here
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      const myClientId = Math.floor(Math.random() * 1000000).toString();
      setClientId(myClientId);
      socket.send(JSON.stringify({ type: "register", receiverId: myClientId }));
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "registration") {
        setClientId(message.clientId);
      } else if (message.type === "file") {
        const fileUri = await saveBase64ToFile(
          message.file.base64,
          message.file.name,
          message.file.type
        );
        setReceivedFile({ ...message.file, uri: fileUri });
        setIsReceivedFileModalVisible(true);
      } else if (message.error) {
        console.error("Error:", message.error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        setFile({
          name: pickedFile.name,
          uri: pickedFile.uri,
          type: pickedFile.mimeType || "application/octet-stream", // Use a default MIME type if unknown
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const convertFileToBase64 = async (uri: string): Promise<string> => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  };

  const sendFileToReceiver = async () => {
    if (!file || !receiverId) {
      alert("Please select a file and enter receiver ID");
      return;
    }

    if (ws) {
      const base64File = await convertFileToBase64(file.uri);
      const message = {
        type: "file",
        file: {
          name: file.name,
          base64: base64File,
          type: file.type,
        },
        receiverId: receiverId,
        senderId: clientId,
      };
      ws.send(JSON.stringify(message));
      setIsModalVisible(true);
    }
  };

  const saveBase64ToFile = async (
    base64: string,
    fileName: string,
    fileType: string
  ): Promise<string> => {
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await FileSystem.makeDirectoryAsync(fileUri.replace(fileName, ""), {
      intermediates: true,
    });
    return fileUri;
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const closeReceivedFileModal = () => {
    setIsReceivedFileModalVisible(false);
  };

  const openFile = async () => {
    if (receivedFile?.type.startsWith("image/")) {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          await MediaLibrary.saveToLibraryAsync(receivedFile.uri);
          Alert.alert("File saved to gallery");
        } else {
          Alert.alert("Permission required to save file to gallery");
        }
      } catch (error) {
        console.error("Error saving file to gallery:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File Sharing</Text>
      {clientId ? (
        <Text style={styles.clientId}>Your Client ID: {clientId}</Text>
      ) : "Something went wrong. Please try again later."}
      <Button title="Pick a File" onPress={pickFile} />
      {file && (
        <View style={styles.filePreview}>
          <Text style={styles.fileInfo}>{file.name}</Text>
          {file.type.startsWith("image/") ? (
            <Image source={{ uri: file.uri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.fileTypeInfo}>File type: {file.type}</Text>
          )}
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter Receiver ID"
        value={receiverId}
        onChangeText={setReceiverId}
      />
      <Button
        title="Send File"
        onPress={sendFileToReceiver}
        disabled={!file || !receiverId}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>File sent to {receiverId}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isReceivedFileModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {receivedFile && (
              <>
                <Text style={styles.modalText}>
                  File received: {receivedFile.name}
                </Text>
                {receivedFile.type.startsWith("image/") && (
                  <Image
                    source={{ uri: receivedFile.uri }}
                    style={styles.imagePreview}
                  />
                )}
                <TouchableOpacity style={styles.modalButton} onPress={openFile}>
                  <Text style={styles.buttonText}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={closeReceivedFileModal}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  clientId: {
    fontSize: 16,
    marginBottom: 10,
    color: "gray",
  },
  filePreview: {
    marginVertical: 20,
    alignItems: "center",
  },
  fileInfo: {
    fontSize: 16,
  },
  fileTypeInfo: {
    marginTop: 10,
    fontSize: 14,
    color: "gray",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: "80%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
  },
});

export default FileSharingScreen;
