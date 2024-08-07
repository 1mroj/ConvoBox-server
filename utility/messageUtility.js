const messageUtility = {};
messageUtility.sendTextMessage = (messageInfo) => {
  if (!messageInfo || !messageInfo.reciver || !messageInfo.message) {
    throw new Error("Invalid messageInfo object");
  }

  let body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `${messageInfo.reciver}`,
    type: "text",
    text: {
      preview_url: false,
      body: `${messageInfo.message}`,
    },
  };
  return body;
};

export default messageUtility;
