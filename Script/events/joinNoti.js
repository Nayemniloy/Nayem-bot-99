const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.1.0",
  credits: "nx nayem",
  description: "Welcome new members with a funny image"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageData, author } = event;
  const addedUser = logMessageData.addedParticipants[0];
  const userName = addedUser.fullName;
  const userID = addedUser.userFbId;

  const threadInfo = await api.getThreadInfo(threadID);
  const memberCount = threadInfo.participantIDs.length;

  const addedByInfo = await api.getUserInfo(author);
  const addedByName = addedByInfo[author]?.name || "Someone";

  // 🖼️ Funny welcome image
  const imageUrl = "https://i.imgur.com/SO5OvKw.jpg"; // direct image link

  const imagePath = __dirname + "/cache/welcome.jpg";
  const imageRes = await axios.get(imageUrl, { responseType: "stream" });
  imageRes.data.pipe(fs.createWriteStream(imagePath));
  await new Promise(resolve => imageRes.data.on("end", resolve));

  const message = {
    body: `🥰 ASSALAMUALAIKUM ${userName}, welcome to our APT GANG 🍻🐻 Group 😊

· I Hope You Will follow Our Group Rules
· !rules for Group rules
· !help For all Commands

· You Are The ${memberCount}th Member in Our Group
· Added By: ${addedByName}`,
    attachment: fs.createReadStream(imagePath)
  };

  api.sendMessage(message, threadID, () => fs.unlinkSync(imagePath));
};
