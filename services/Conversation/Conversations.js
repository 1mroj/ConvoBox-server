import { PrismaClient } from "@prisma/client";

const conversationServices = {};

const prisma = new PrismaClient();
conversationServices.findconversationwithNumbers = async (
  buisnessNumber,
  contactnumber
) => {
  try {
    const converstions = await prisma.conversations.findFirst({
      where: {
        buisnessNumber: buisnessNumber,
        PhoneNumber: contactnumber,
      },
    });
    if (converstions) {
      return { status: 200, data: converstions };
    } else {
      return { status: 404, data: null };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, data: null };
  }
};

conversationServices.createconversation = async (
  buisnessNumber,
  phoneNumber,
  name
) => {
  try {
    const converstions = await prisma?.conversations?.create({
      data: {
        buisnessNumber: buisnessNumber,
        PhoneNumber: phoneNumber,
        conversationName: name,
      },
    });
    if (converstions) {
      return { status: 200, data: converstions };
    } else {
      return { status: 404, data: null };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, data: null };
  }
};

conversationServices.storemesage = async (
  conversationid,
  message,
  senderId,
  messageevent
) => {
  try {
    const storedmessage = await prisma?.messages?.create({
      data: {
        messageId: message?.id,
        message: message?.text?.body,
        messageEvent: messageevent,
        messageType: message?.type,
        senderId: senderId,
        conversationId: conversationid,
        timestamp: message?.timestamp,
      },
    });
    console.log(storedmessage);
    return { status: 200, data: storedmessage };
  } catch (error) {
    return { status: 200, data: null };
  }
};

export default conversationServices;
