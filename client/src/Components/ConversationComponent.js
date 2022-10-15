import React, { useState, useEffect } from "react";
import Picker from "emoji-picker-react";
import styled from "styled-components";
import { SearchContainer, SearchInput } from "./ContactListComponent";
import httpManager from "../managers/httpManager";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 3;
  background: #f6f7f8;
`;
const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  background: #ededed;
  padding: 10px;
  align-items: center;
  gap: 10px;
`;
const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const ChatBox = styled.div`
    display: flex;
    background: #f0f0f0;
    padding: 10px;
    align-items: center;
`
const EmojiImage = styled.img`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    opacity: 0.4;
    cursor: pointer;
`
const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #e5ddd6;
    overflow-y: auto;
`
const MessageDiv = styled.div`
    justify-content: ${(props) => (props.isYours ? "flex-end" : "flex-start")};
    display: flex;
    margin: 5px 15px;
`
const Message = styled.div`
    background: ${(props) => (props.isYours ? "#daf8cb" : "white")};
    max-width: 50%;
    color: #303030;
    padding: 8px 10px;
    font-size: 14px;
    border-radius: 4px;
`
const ConversationComponent = (props) => {
  const { selectedChat, userInfo, refreshContactList } = props;
  const [ text, setText ] = useState("");
  const [ pickerVisible, togglePicker ] = useState(false);
  const [ messageList, setMessageList ] = useState([]);
  

  useEffect(() => {
   setMessageList(selectedChat.channelData.messages);
  }, [selectedChat]);
  
  const onEmojiClick = (event, emojiObj) => {
      setText(text+emojiObj.emoji);
      togglePicker(false);
  }
  const onEnterPress = async (event) => {
    if(event.key === 'Enter'){
      let channelId = selectedChat.channelData._id;
      if(!messageList || !messageList.length) {
        const channelUsers = [
          {
            email: userInfo.email,
            name: userInfo.name,
            profilePic: userInfo.picture
          },
          {
            email: selectedChat.otherUser.email,
            name: selectedChat.otherUser.name,
            profilePic: selectedChat.otherUser.profilePic
          }
        ];
        const channelResponse = await httpManager.createChannel({channelUsers});
        channelId = channelResponse.data.responseData._id;
        
      }
      refreshContactList();
      const messages = [...messageList];
      const msgReqData = {
          text,
          senderEmail: userInfo.email,
          addedOn: new Date().getTime(),
      }
      const messageResponse = await httpManager.sendMessage({
        channelId,
        messages: msgReqData
      });
      messages.push(msgReqData);
      setMessageList(messages);
      setText("");
    }
  }
  return (
    <Container>
      <ProfileHeader>
        <ProfileImage src={selectedChat.otherUser.profilePic} />
        {selectedChat.otherUser.name}
      </ProfileHeader>
      <MessageContainer>
        {messageList?.map((messageData) => (
          <MessageDiv isYours={messageData.senderEmail === userInfo.email}>
          <Message isYours={messageData.senderEmail === userInfo.email}>{[messageData.text]}</Message>
        </MessageDiv>
        ))}
      </MessageContainer>
      <ChatBox>
        <SearchContainer>
            {pickerVisible && (
              <Picker
              pickerStyle={{ position: "absolute", bottom: "60px"}} 
              onEmojiClick={onEmojiClick} />
            )}
            <EmojiImage src="data.svg" onClick={() => togglePicker(!pickerVisible)}/>
            <SearchInput placeholder="Type a message" value={text} onKeyDown={onEnterPress} onChange={(e) => setText(e.target.value) }/>
        </SearchContainer>
      </ChatBox>
    </Container>
  );
};
export default ConversationComponent;
